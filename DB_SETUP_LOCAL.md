# MongoDB Local Setup Guide


This guide walks you through the process of exporting collections from a remote MongoDB database and importing them into your local MongoDB setup.

---

## Collections Involved

- `icards`
- `iimages`
- `itags`
- `iusers`

---

## Step 1: Export Collections from Remote Server

SSH into the remote server and run the following commands to export MongoDB collections:

```bash
mongoexport --db database --collection icards --out icards.json
mongoexport --db database --collection iimages --out iimages.json
mongoexport --db database --collection itags --out itags.json
mongoexport --db database --collection iusers --out iusers.json
```

✅ Each command will confirm the number of documents exported.

---

## Step 2: Copy Exported Files to Local Machine

On your local system, create a folder for storing the database export files:

```bash
mkdir database_exports
cd database_exports
```

Use `scp` to securely copy the exported files from the remote server to your local machine:

```bash
scp dhroot@129.10.111.197:icards.json .
scp dhroot@129.10.111.197:iimages.json .
scp dhroot@129.10.111.197:itags.json .
scp dhroot@129.10.111.197:iusers.json .
```

🔑 You’ll be prompted to enter the remote server’s password during the copy process.

---

## Step 3: Import Collections into Local MongoDB

Once you have the JSON files on your local machine, import each collection into your local MongoDB database:

```bash
mongoimport --db database --collection icards --file icards.json
mongoimport --db database --collection iimages --file iimages.json
mongoimport --db database --collection itags --file itags.json
mongoimport --db database --collection iusers --file iusers.json
```

✅ You should see a success message for each import.

---

## Step 4: Verify the Imported Data

Launch the Mongo shell:

```bash
mongosh
```

Switch to the imported database and list the collections:

```js
use database
show collections
```

You can also verify records:

```js
db.icards.findOne()
db.iimages.findOne()
db.itags.findOne()
db.iusers.findOne()
```

---

## Notes & Troubleshooting

- Ensure MongoDB is installed and running locally before using `mongoimport`.
- To start MongoDB on macOS (Homebrew):
  ```bash
  brew services start mongodb-community
  ```
- If `mongosh` or `mongoimport` is not found, ensure your MongoDB binaries are in your system path.

