#!/usr/bin/env bash
#
# scripts/dev.sh - Start the full local dev environment:
#   1. MongoDB (Docker, port 27019)
#   2. Payload CMS dev server (native, port 4101)
#   3. Nuxt blog dev server (native, port 4100)
#
# Usage: ./scripts/dev.sh
# Ctrl+C stops everything (CMS is killed, MongoDB is left running).

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CMS_DIR="$ROOT_DIR/cms"

# Ports (keep in sync with AGENTS.md)
NUXT_PORT=4100
CMS_PORT=4101

# -- Helpers -------------------------------------------------------------------

# Colored [dev] prefix - falls back to plain text when not attached to a TTY
if [ -t 1 ]; then
  C_BLUE=$'\033[1;34m'; C_RED=$'\033[1;31m'; C_GREEN=$'\033[1;32m'; C_RESET=$'\033[0m'
else
  C_BLUE=""; C_RED=""; C_GREEN=""; C_RESET=""
fi

log()  { printf '%s[dev]%s %s\n' "$C_BLUE" "$C_RESET" "$1"; }
ok()   { printf '%s[dev OK]%s %s\n' "$C_GREEN" "$C_RESET" "$1"; }
fail() { printf '%s[dev FAIL]%s %s\n' "$C_RED" "$C_RESET" "$1" >&2; exit 1; }

port_pid() {
  lsof -ti ":$1" 2>/dev/null || true
}

# Wait until a TCP port accepts connections (timeout in seconds)
wait_for_port() {
  local port=$1 name=$2 timeout=${3:-60} elapsed=0
  until nc -z localhost "$port" 2>/dev/null; do
    if [ "$elapsed" -ge "$timeout" ]; then
      fail "$name did not become ready on port $port within ${timeout}s"
    fi
    sleep 1
    elapsed=$((elapsed + 1))
  done
}

# -- Pre-flight checks ---------------------------------------------------------

command -v docker >/dev/null 2>&1 || fail "docker is not installed or not in PATH"
command -v pnpm   >/dev/null 2>&1 || fail "pnpm is not installed or not in PATH"
command -v nc     >/dev/null 2>&1 || fail "nc (netcat) is not installed or not in PATH"

# Docker daemon must actually be running (not just installed)
docker info >/dev/null 2>&1 || fail "Docker daemon is not running - start Docker Desktop first"

# Dependencies must be installed in both workspaces
[ -d "$ROOT_DIR/node_modules" ] || fail "root dependencies missing - run 'pnpm install' first"
[ -d "$CMS_DIR/node_modules" ] || fail "cms dependencies missing - run 'cd cms && pnpm install' first"

[ -f "$CMS_DIR/.env" ] || fail "cms/.env is missing - see AGENTS.md for setup"

ok "Pre-flight checks passed"

# -- 1. MongoDB ----------------------------------------------------------------

log "Starting MongoDB (docker compose)..."
docker compose up -d mongodb

log "Waiting for MongoDB to be healthy..."
status="unknown"
for _ in $(seq 1 30); do
  status="$(docker inspect --format '{{.State.Health.Status}}' "$(docker compose ps -q mongodb)" 2>/dev/null || echo unknown)"
  [ "$status" = "healthy" ] && break
  sleep 1
done
[ "$status" = "healthy" ] || fail "MongoDB failed to become healthy"
ok "MongoDB is healthy (localhost:27019)"

# -- 2. Payload CMS ------------------------------------------------------------

CMS_PID=""
NUXT_PID=""
SHUTTING_DOWN=false

# Kill a process and all of its children (npx/next spawn workers that would
# otherwise survive a plain `kill`).
kill_tree() {
  local pid=$1
  [ -z "$pid" ] && return 0
  # Kill children first (bottom-up) so they don't get reparented
  local child
  for child in $(pgrep -P "$pid" 2>/dev/null || true); do
    kill_tree "$child"
  done
  kill "$pid" 2>/dev/null || true
}

cleanup() {
  # Guard against double-invocation (INT/TERM both firing, then EXIT)
  $SHUTTING_DOWN && return 0
  SHUTTING_DOWN=true

  log "Shutting down..."
  kill_tree "$NUXT_PID"
  kill_tree "$CMS_PID"
  wait "$NUXT_PID" "$CMS_PID" 2>/dev/null || true
  log "Done. MongoDB is still running - 'docker compose down' to stop it."
}
trap cleanup EXIT INT TERM

if [ -n "$(port_pid "$CMS_PORT")" ]; then
  log "Port $CMS_PORT already in use - assuming CMS is already running, skipping CMS startup."
else
  log "Starting Payload CMS dev server on port $CMS_PORT..."
  (cd "$CMS_DIR" && NODE_OPTIONS='--no-deprecation' npx next dev --webpack -p "$CMS_PORT") &
  CMS_PID=$!
fi

log "Waiting for CMS to be ready..."
wait_for_port "$CMS_PORT" "Payload CMS" 90
ok "CMS ready -> http://localhost:$CMS_PORT/admin"

# -- 3. Nuxt blog (foreground) -------------------------------------------------

if [ -n "$(port_pid "$NUXT_PORT")" ]; then
  fail "Port $NUXT_PORT is already in use - stop the existing Nuxt process first (kill \$(lsof -ti :$NUXT_PORT))."
fi

log "Starting Nuxt dev server on port $NUXT_PORT..."
log "Blog will be available at http://localhost:$NUXT_PORT"
pnpm run dev &
NUXT_PID=$!
wait "$NUXT_PID"
