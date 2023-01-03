# Getting started

## Set up a PlanetScale database

After logging into PlanetScale, you can create a new database by clicking on "New database". You will give it a name (you'll need this later).

## Install Dependencies

Install the project's dependencies by running:

```
yarn install
```

## Setup ENV file

Copy the `.env.example` file and rename it to `.env`. Populate the `DATABASE_URL` variable replacing `<USERNAME>`, `<PASSWORD>`, `<HOST>` and `<DATABASE_NAME>` with the values from PlanetScale.
These details can be found by clicking on "Connect" from the PlansetScale dashboard (after selecting the database name) and selecting "Connect width Node.js".

```
DATABASE_URL='mysql://<USERNAME>:<PASSWORD>@<HOST>/<DATABASE_NAME>?sslaccept=strict'
```

## Why Prisma?

[Prisma](https://www.prisma.io/) is a ORM library for our PlanetScale database. This is useful so we can do the following:

- Build type definitions of our tables.
- CRUD records from our tables as if they were models.

The rest of this README [follows this guide](https://www.prisma.io/docs/getting-started/quickstart) from Prisma and [this guide](https://planetscale.com/docs/tutorials/automatic-prisma-migrations) from PlanetScale.

There are two methods of using migrations

### 1. PlanetScale Migrations (Slower, more robust)

Using this method, we create branches on the database (much like our code) and open up merge requests before applying to a production branch. This resolves issues causing blocking merge requests and we can also revert branch merge changes (up to 30 minutes).

From a high level, Prisma's db push introspects your PlanetScale database to infer and execute the changes required to make your database schema reflect the state of your Prisma schema. When prisma db push is run, it will ensure the schema in the PlanetScale branch you are currently connected to matches your current Prisma schema.

When using PlanetScale with Prisma, the responsibility of applying the changes is on the PlanetScale side. Therefore, there is little value to using `prisma migrate` with PlanetScale.

#### Prerequisites

- Add Prisma to your project using `yarn add prisma --dev`.
- Run `npx prisma init` inside of your project to create the initial files needed for Prisma.
- [Install the PlanetScale CLI.](https://github.com/planetscale/cli)
- Authenticate the CLI with the following command:

```
pscale auth login
```

#### Quickly create and connect to a new branch

You can quickly create and connect to branch by running:

```
./branch.sh new-branch-name
```

> Note: Ensure you do not have a running service of `pscale connect` which could cause conflict in ports.

> Note: The `branch.sh` script has hardcoded the database name, this will need to be changed if the repository is cloned.

#### Quickly deploy a migration

After running the above command from "Quickly create and connect to a new branch", you can make your modifications to the schema file.

After making those changes, run this command in a new terminal

```
npx prisma db push
```

You can now create a merge request in PlanetScale.

> To update your Typescript definitions, run `npx prisma generate`.

#### Further reading

Continue following this guide: https://planetscale.com/docs/tutorials/automatic-prisma-migrations#execute-your-first-prisma-db-push

### 2. Prisma Migrations (Quicker development, less robust)

> This method is very similar to how traditional frameworks create database migrations like Laravel.

If we use this option, we can commit migrations inside PRs which will be applied to a production database. During development, each engineer could have their own branch which will only consist of their development. When a PR is created, this is checked by another engineer and on approval, we could have a Git Action script run to push the changes to the PlanetScale's production branch.

Following this guide:
https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-planetscale
