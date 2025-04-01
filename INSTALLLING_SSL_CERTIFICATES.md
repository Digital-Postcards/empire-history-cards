# Setting up SSL with Let's Encrypt and Certbot for Apache on Ubuntu

## **Prerequisites**

Ensure that:

- The domain (`visualdomesticlaborhistory.khoury.northeastern.edu`) is pointing to the server's IP.
- Apache is installed and running.
- You have sudo privileges on the server.

---

## **Step 1: Install Certbot for Apache**

First, update your package list and install Certbot along with the Apache plugin:

```bash
sudo apt update
sudo apt install certbot python3-certbot-apache -y
```

---

## **Step 2: Obtain and Install an SSL Certificate**

Run the following command to request and install an SSL certificate for your domain:

```bash
sudo certbot --apache -d visualdomesticlaborhistory.khoury.northeastern.edu
```

- Certbot will prompt you for an email and ask you to agree to the terms of service.
- Choose **option 2** when asked whether to redirect HTTP to HTTPS.

---

## **Step 3: Verify Apache Configuration**

After installation, confirm that the Apache configuration is correct:

```bash
sudo apachectl configtest
```

If the output is `Syntax OK`, restart Apache to apply the changes:

```bash
sudo systemctl restart apache2
```

---

## **Step 4: Enable Auto-Renewal**

Let’s Encrypt certificates expire every **90 days**. Certbot automatically sets up renewal, but you should test it:

```bash
sudo certbot renew --dry-run
```

If there are no errors, your SSL certificate will renew automatically.

To manually force renewal at any time, run:

```bash
sudo certbot renew
```

You can also add a cron job to check renewal daily. Open the cron editor:

```bash
sudo crontab -e
```

Add this line at the bottom to check and renew SSL daily at midnight:

```bash
0 0 * * * certbot renew --quiet
```

---

## **Step 5: Force Redirect HTTP to HTTPS (If Not Already Configured)**

If Certbot did not automatically configure redirection, manually enforce HTTPS:

1. Open the Apache configuration file:
   ```bash
   sudo nano /etc/apache2/sites-available/000-default.conf
   ```
2. Add the following block at the beginning:
   ```apache
   <VirtualHost *:80>
       ServerName visualdomesticlaborhistory.khoury.northeastern.edu
       Redirect permanent / https://visualdomesticlaborhistory.khoury.northeastern.edu/
   </VirtualHost>
   ```
3. Save the file (press **Ctrl + X**, then **Y**, then **Enter**).
4. Restart Apache to apply changes:
   ```bash
   sudo systemctl restart apache2
   ```

---

## **Step 6: Verify HTTPS Configuration**

To verify that HTTPS is working correctly:

- Open a web browser and visit `https://visualdomesticlaborhistory.khoury.northeastern.edu`.
- Run this command in the terminal:
  ```bash
  curl -I https://visualdomesticlaborhistory.khoury.northeastern.edu
  ```
  If the output includes `HTTP/2 200 OK`, SSL is properly configured.

---

## **Troubleshooting**

### **Check Certbot Logs for Errors:**

```bash
sudo cat /var/log/letsencrypt/letsencrypt.log
```

### **Ensure Apache is Running Correctly:**

```bash
sudo systemctl status apache2
```

### **Allow HTTPS Traffic through Firewall:**

```bash
sudo ufw allow 'Apache Full'
sudo systemctl restart apache2
```

---
