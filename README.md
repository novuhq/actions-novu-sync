# Novu Sync Action V2

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/novuhq/actions-novu-sync/ci.yml)

This action syncs your state with Novu Cloud.

## What's new

Please refer to the [release page](https://github.com/novuhq/actions-novu-sync/releases/latest)
for the latest release notes.

## Usage

```yaml
- uses: novuhq/actions-novu-sync@v2
  with:
    # The secret key used to authenticate with Novu Cloud
    # To get the secret key, go to https://web.novu.co/api-keys.
    # Required.
    secret-key: ${{ secrets.NOVU_SECRET_KEY }}

    # The publicly available endpoint hosting the bridge application
    # where notification entities (eg. workflows, topics) are defined.
    # Required.
    bridge-url: ${{ secrets.NOVU_BRIDGE_URL }}

    # The Novu Cloud API URL to sync with.
    # Optional.
    # Defaults to https://api.novu.co
    api-url: https://api.novu.co
```

### Sync with Novu Cloud

```yaml
- uses: novuhq/actions-novu-sync@v2
  with:
    secret-key: ${{ secrets.NOVU_SECRET_KEY }}
    bridge-url: ${{ secrets.NOVU_BRIDGE_URL }}
```

### Sync with Novu Cloud EU region

```yaml
- uses: novuhq/actions-novu-sync@v2
  with:
    secret-key: ${{ secrets.NOVU_SECRET_KEY }}
    bridge-url: ${{ secrets.NOVU_BRIDGE_URL }}
    api-url: https://eu.api.novu.co
```

## Outputs

The command exposes 2 outputs:

1. `success`: a boolean flag indicating the success status of the action execution
1. `result`: the response data sent from Novu Cloud after the sync request

## Developing the action further

1. 🔨 Install the dependencies

   ```bash
   npm install
   ```

1. 🏗️ Lint, test and package the TypeScript for distribution

   ```bash
   npm run all
   ```

## Publishing a New Release

This project includes a helper script, [`script/release`](./script/release)
designed to streamline the process of tagging and pushing new releases for
GitHub Actions.

GitHub Actions allows users to select a specific version of the action to use,
based on release tags. This script simplifies this process by performing the
following steps:

1. **Retrieving the latest release tag:** The script starts by fetching the most
   recent release tag by looking at the local data available in your repository.
1. **Prompting for a new release tag:** The user is then prompted to enter a new
   release tag. To assist with this, the script displays the latest release tag
   and provides a regular expression to validate the format of the new tag.
1. **Tagging the new release:** Once a valid new tag is entered, the script tags
   the new release.
1. **Pushing the new tag to the remote:** Finally, the script pushes the new tag
   to the remote repository. From here, you will need to create a new release in
   GitHub and users can easily reference the new tag in their workflows.
