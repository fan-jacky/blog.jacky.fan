<template>
    <div class="navbar bg-base-200 shadow-md">
        <div class="flex-1">
                <NuxtLink to="/" class="btn btn-ghost normal-case text-xl font-dosis drop-shadow">🖋️<span
                    class="text-primary">Jacky
                    FAN's</span>
                Blog</NuxtLink>
        </div>
        <div class="flex-none">
            <ul class="menu menu-horizontal px-1 hidden md:flex">
                <!-- <li><a href="mailto:contact@jacky.fan"><IconsMail /></a></li> -->
                <li>
                    <NuxtLink to="/" title="Home Page">
                        <IconsHome />
                    </NuxtLink>
                </li>
                <li><a href="/rss.xml" title="RSS Feed">
                        <IconsRss />
                    </a></li>
            </ul>
        </div>
    </div>
</template>