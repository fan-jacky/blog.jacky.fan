# Deploy Instruction

This document describes how to deploy the blog and Payload CMS using Docker Compose.

---

## Architecture

| Service    | Description                                  | Default Port |
|------------|----------------------------------------------|--------------|
| `mongodb`  | MongoDB 7 database used by Payload CMS       | (internal)   |
| `cms`      | Payload CMS admin panel and REST API         | `3001`       |
| `web`      | Nuxt 3 blog                                  | `3000`       |

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) ≥ 24
- [Docker Compose](https://docs.docker.com/compose/) ≥ 2 (included in Docker Desktop)
- A server or VM with at least 1 GB RAM

---

## 1. Clone the repository

```bash
git clone https://github.com/fan-jacky/blog.jacky.fan.git
cd blog.jacky.fan
```

---

## 2. Configure environment variables

### Blog (`web` service)

```bash
cp .env.example .env
```

Edit `.env` and fill in:

| Variable          | Description                                                                 |
|-------------------|-----------------------------------------------------------------------------|
| `PREVIEW_SECRET`  | A random string shared with the CMS to authenticate preview requests        |
| `PAYLOAD_URL`     | Internal Docker network URL for the CMS (leave as `http://cms:3001`)        |
| `PAYLOAD_API_KEY` | API key generated from a CMS user (see step 4)                              |
| `NUXT_PUBLIC_GTAG_ID` | (Optional) Google Analytics measurement ID                             |

### CMS (`cms` service)

```bash
cp cms/.env.example cms/.env
```

Edit `cms/.env` and fill in:

| Variable                    | Description                                                         |
|-----------------------------|---------------------------------------------------------------------|
| `PAYLOAD_SECRET`            | A long random string used to sign JWTs — keep this secret          |
| `PREVIEW_SECRET`            | Must match `PREVIEW_SECRET` in the blog `.env`                     |
| `PAYLOAD_PUBLIC_SERVER_URL` | Public URL where the CMS admin is accessible, e.g. `https://cms.example.com` |
| `PAYLOAD_PUBLIC_SITE_URL`   | Public URL of the blog, e.g. `https://blog.example.com`            |

Generate strong secrets with:

```bash
openssl rand -base64 32
```

---

## 3. Build and start all services

```bash
docker compose up -d --build
```

This will:
1. Build the Payload CMS image and the Nuxt blog image.
2. Pull the MongoDB image.
3. Start all three services in the background.

Check that all containers are running:

```bash
docker compose ps
```

View logs:

```bash
# All services
docker compose logs -f

# Single service
docker compose logs -f cms
docker compose logs -f web
```

---

## 4. Create the first CMS admin user

On first boot, Payload CMS has no users. Visit the admin panel to create the initial admin account:

```
http://<your-server-ip>:3001/admin
```

Follow the on-screen prompts to create a user with the **Admin** role.

---

## 5. Generate an API key for preview mode

The Nuxt blog uses a Payload API key to fetch draft posts during content preview.

1. In the Payload admin, open the user you created in step 4.
2. Scroll to the **API Key** section and click **Generate**.
3. Copy the generated key.
4. Paste it as `PAYLOAD_API_KEY` in the blog's `.env` file.
5. Restart the `web` service:

```bash
docker compose restart web
```

---

## 6. Using the preview feature

When editing a post in Payload CMS:

1. Save a draft version of the post.
2. Click the **Preview** button in the top-right of the editor.
3. A new tab opens the blog at `/cms-preview/<slug>` with a yellow **Preview Mode** banner.
4. Click **Exit Preview** in the banner to leave preview mode.

> The preview URL is valid for 1 hour. After that, re-click Preview in the admin.

---

## 7. Updating the deployment

Pull the latest code and rebuild:

```bash
git pull
docker compose up -d --build
```

Only changed services are rebuilt. MongoDB data is persisted in the `mongodb_data` volume.

---

## 8. Stopping and removing services

Stop services (data is preserved):

```bash
docker compose down
```

Stop services and remove all volumes (⚠️ **deletes all data**):

```bash
docker compose down -v
```

---

## 9. Backups

### MongoDB

Export the database:

```bash
docker compose exec mongodb mongodump --db blog-cms --archive \
  | gzip > backup-$(date +%Y%m%d).gz
```

Restore:

```bash
gunzip -c backup-YYYYMMDD.gz \
  | docker compose exec -T mongodb mongorestore --archive
```

### Uploaded media

The `cms_uploads` Docker volume contains images uploaded through the CMS. Back it up with:

```bash
docker run --rm \
  -v blog-cms_cms_uploads:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/uploads-$(date +%Y%m%d).tar.gz /data
```

---

## 10. Reverse proxy (optional)

For production, place a reverse proxy (e.g. Nginx or Caddy) in front of both services to enable HTTPS.

Example Caddy configuration:

```caddyfile
blog.example.com {
    reverse_proxy web:3000
}

cms.example.com {
    reverse_proxy cms:3001
}
```

Add the Caddy service to `docker-compose.yml` on the same `blog_network` and update `PAYLOAD_PUBLIC_SERVER_URL` / `PAYLOAD_PUBLIC_SITE_URL` in the respective `.env` files.
