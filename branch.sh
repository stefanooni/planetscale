#!/bin/bash
pscale branch create spike $1 --wait &&
echo -e "\n'$1' branch successfully created.\nNow connecting to branch..." &&
pscale connect spike $1 --port 3309
