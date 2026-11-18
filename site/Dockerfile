# Railway (or any container host): serves the static site with nginx.
# Deploy from the site/ directory. Railway injects $PORT; nginx's template step fills it in.
FROM nginx:1.27-alpine
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY index.html home-2.html home-3.html home-4.html home-5.html home-6.html home-7.html brand.html os.html about.html privacy.html terms.html /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
ENV PORT=8080
EXPOSE 8080
