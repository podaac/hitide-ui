### UMM-T Update
This directory holds files for updating the service's CMR UMM-T profile.

Core files for CMR UMM-T update and associations are:
* cmr.Dockerfile (for running the script via Jenkins)
* run_ummt_updater.sh (for executing the command line request)
* ops_hitide_cmr_umm_t.json (UMM-T profile to keep updated locally for OPS)
* ops_associations.txt (list of concept_ids, one per line, to be associated with UMM-T for OPS)
* uat_hitide_cmr_umm_t.json (UMM-T profile to keep updated locally for UAT)
* uat_associations.txt (list of concept_ids, one per line, to be associated with UMM-T for UAT)