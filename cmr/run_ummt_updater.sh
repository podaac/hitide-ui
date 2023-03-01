#!/usr/bin/env bash
set -Exo pipefail

tf_venue=$1
hitide_version=$2
token_file=$3
file=cmr/${tf_venue}_hitide_cmr_umm_t.json

set +x

token=$(jq -r .token $token_file)
jq --arg a $hitide_version '.Version = $a' $file > cmr/cmr.json
ummt_updater -d -f cmr/cmr.json -a cmr/${tf_venue}_associations.txt -p POCLOUD -e ${tf_venue} -t "$token"

set -x