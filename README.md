# Good Defaults

## ❓ What's this?

`Good Defaults` is a CLI tool that helps you set up your development environment for Typescript. It is a simple way to get started with a new project if you are unfamiliar with different configurations.

Just run the tool and you can get started with your new projects without having to worry about all the boring stuff!

> **Note:** I made this project to suit my own needs and the configurations provided might not suit your need.

## 🧩 What's included?

- ESLint + Prettier
- VSCode Settings & Extensions
- TSConfig
- GitHub Actions CI Workflow w/ Caching

## 🛠 How to use it?

1. Run the binary _(currently only works on pnpm)_:

```bash
pnpm dlx good-defaults
```

2. Select the configurations you would like to have.
3. Done 🚀

## 💖 Contributing

As mentioned above, I made this to suit my own needs. However, I am happy to be convinced for other configurations.

If you have something you'd like to add or modify, please open an issue or pull request.

## 📜 References

- A lot of the CLI tooling is based on [`create-t3-app`](https://github.com/t3-oss/create-t3-app).
- Thanks [@joshuakgoldberg](https://github.com/JoshuaKGoldberg) for inspiring on the [`.eslintrc`](./.eslintrc)
