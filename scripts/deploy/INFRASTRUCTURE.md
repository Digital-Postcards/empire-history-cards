# Deployment infrastructure

The entire application (frontend and backend) are deployed on a virtual machine provided by Khoury College of Computer Sciences and can be accessed via their [Xen Orchestra web UI](https://xen-orchestra.khoury.northeastern.edu).

### Virtual machine specifications
- Compute cores: 2
- RAM: 4 GB
- Disk space: 100 GB

Refer to the instructions given [here](https://github.com/Digital-Postcards/empire-history-cards/tree/main/scripts/deploy#connecting-to-the-server) to perform operations on the server. It is highly recommended that you do not change anything in production unless you know what is going to happen!

## General outline

The VM uses an [Apache web server](https://www.geeksforgeeks.org/how-to-use-apache-webserver-to-host-a-website/) to serve static files as well as route requests to the backend as it acts as a [reverse proxy](https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/). Apache configuration files in specific exist in the `/etc/apache2/` directory.

The frontend and backend are deployed on the same VM. The frontend is served directly via `/var/www/digitalhum` after the build files are copied into that folder.

The individual configuration files are as outlined below. Specific values/details have been left out for generality.

### Frontend configuration
**File path** `/etc/apache2/sites-available/digitalhumfrontend.conf`
```
# Port 80 for HTTP requests
<VirtualHost *:80>
    ServerAdmin <admin-email>   # ideally an active contributor
    ServerName <domain-name-or-ip-address>
    DocumentRoot /var/www/digitalhum    # location where the build files exist

    <Directory /var/www/digitalhum>
        Options Indexes MultiViews
        AllowOverride None
        Require all granted
    </Directory>

    ProxyRequests Off
    ProxyPreserveHost On
    ProxyVia Full
    <Proxy *>
        Require all granted
    </Proxy>

    # error logging for the web server
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

### Backend configuration
**File path** `/etc/apache2/sites-available/digitalhum.conf`
```
<VirtualHost *:80>
    ServerAdmin <admin-email> # ideally an active contributor
    ServerName <domain-name-or-ip-address>
    
    ProxyRequests Off
    ProxyPreserveHost On
    ProxyVia Full
    <Proxy *>
        Require all granted
    </Proxy>
    <Location /api> # path to route to for API requests
        ProxyPass http://localhost:3002/api # URL where the API service is running on the VM
        ProxyPassReverse http://localhost:3002/api
    </Location>

    # for serving static image content from the server
    ProxyPass /public http://localhost:3002/public
    ProxyPassReverse /public http://localhost:3002/public

    # error logging for the web server
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```