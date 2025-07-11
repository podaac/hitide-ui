# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
### Changed
### Removed
### Fixed

## [4.17.3]
### Added
- Added a README.md file
### Changed
- Update github actions to use launchpad token updating umm-t
### Removed
### Fixed
- issue-79: Fixed "Add Matching X Granules To Download" button
- issue-83: limit harmony call to 1000
- Fixed missing extraction variables selection

## [4.17.2]
### Added
### Changed
### Removed
### Fixed
- issue-44: Fixed footprints and previews stay on map when not intended
- issue-65: Fixed footprints and previews disappearing from map when not intended

## [4.17.0]
### Added
- Added global_grid configuration check to make a global extent for images.
### Changed
### Removed
### Fixed
- issue-42: Fixed collection thumbnails not loading for certain collections
- issue-48: Fixed collection resolution error handling
- issue-49: Removed unused Docker and Jenkins folders/files from HiTIDE-UI
- issue-52: Fixed missing thumbnail placeholder
- issue-44: Fixed footprints and previews stay on map when not intended

## [4.16.2]
### Added
### Changed
### Removed
### Fixed
- issue-38: Removed shortName retrieval operation from variable graphql query

## [4.16.1]
### Added
### Changed
### Removed
- issue-15: Removed last references to on-prem l2ss and podaac-tools
### Fixed
- issue-33: Fixed collection resolution displaying multiple resolutions and scaling

## [4.16.0]
### Added
### Changed
- issue-15: Getting cloud resolution metedata using normal get instead of graphql because it is faster
- issue-15: Changed FAQ references to cloud icon and cut scanline
### Removed
- issue-15: Removed references to on-prem l2ss
- issue-15: Removed cloud icons from datasets
- issue-15: Removed cut scanline option in download options tab
### Fixed
- issue-15: Fixed color palette error in the legend when selecting datasets

## [4.15.0]
### Added
- issue-17: Add way to read config files to allow for multiple lat lon for variables images.
- Add in commit message triggers
### Changed
### Removed
### Fixed
- PODAAC-5547: Replace spaces " " in group names to use "_" to work with tig with png names with "_" (replacing spaces)
- Update footprint to allow drawing of polygons with holes
- PODAAC-5326: Fixed 'Add matching granules to download' button

## [4.14.0]
### Added
- Moved repo to https://github.com/podaac/hitide-ui
### Changed
### Removed
### Fixed
- PODAAC-3679: Updated Help, Released Notes page to latest v4.14.0

## [4.13.0]
### Added
- PODAAC-4886: Add CloudMigrationDialog
- PODAAC-4880: Add JASON S6 to forge-tig-configuration
- PODAAC-5124: Added all collections from on-premise to the cloud 
- PODAAC-5223/5224: Added AMSR2-REMSS-L2P-v8.2 and AMSR2-REMSS-L2P_RT-v8.2
### Changed
- PODAAC-4417: Fix the way hitide searches CMR granule metadata for image URLs
### Removed
### Fixed
- PODAAC-5264: Fixed compatibility for some SWOT simulated datasets relating to an extra variable.

## [4.12.0]
### Added
- PODAAC-3512: Can make authenticated CMR requests through Hitide-profile
### Changed
- PODAAC-4610: Remove unused intern-geezer dependency and add snyk check to pipeline
### Removed
### Fixed
- PODAAC-4986: Fix how CMR linestrings, polygons, and preview images are parsed
- PODAAC-4600: Allow multiple Bounding Rectangles to be parsed for a granule

## [4.11.0]
### Added
- PODAAC-4181: Update the HiTIDE FAQ and HITIDE Tutorial to reflect latest cloud changes.
- PODAAC-4254: Constrained terraform/aws provider version to less than v4
- PODAAC-4178: Added get palettes from hitide s3 bucket.
- PODAAC-4171: AVHRRMTA_G-NAVO-L2P-v1.0 Cloud HiTIDE Integration.
- PODAAC-4173: AVHRRMTB_G-NAVO-L2P-v1.0 Cloud HiTIDE Integration.
- PODAAC-4057: HiTIDE build pipeline should use branch name for determining version when a release branch is opened
- PODAAC-4169: Add granule availability for cloud collections
### Changed
### Removed
### Fixed
- PODAAC-4549: Fix parsing linestring footprints from CMR.

## [4.10.0]
### Added
- PODAAC-4014: Cloud subsets with all variables submitted with 'all' instead of full variable array
- PODAAC-3865: Add warning when using cut-scanline on cloud datasets
- PODAAC-3684: Display download links after Harmony subset (stac catalog links)
- PODAAC-3618: Integrate Hitide-profile changes (subsetting with harmony)
- PODAAC-3596: Added facet filtering for pocloud collections
- PODAAC-3613: Added cloud dataset array to payload sent to HiTIDE-Profile
- PODAAC-3360: Cloud datasets now display variables from UMM-V
- PODAAC-3857: Update podaac-dev-tools to 0.7.0, update jenkins to pass launchpad token to update CMR

## [4.9.1]
### Added
### Changed
- PODAAC-3926: Upgraded nginx version to 1.20
### Removed
### Fixed

## [4.9.0]
### Added
- PODAAC-3355: Query CMR for pocloud collections
- PODAAC-3358: Query CMR for footprints and thumbnail images for pocloud datasets
- PODAAC-3357: Created terraform for hitide UI S3 bucket
- PODAAC-3357: Added cloud deploy steps to Jenkins pipeline
### Changed
- PODAAC-3357: UMM-T entry uses project-level version instead of hardcoded version
### Removed
### Fixed
- PODAAC-3356: Fixed datast landing page links for pocloud datasets


## [4.8.2]

### Added
- PODAAC-3353: Added UMM-T collection associations
- PODAAC-1620: Added the ability to track state
- PODAAC-3352: Added automatic UMM-T entry creation/update to CI/CD pipeline

### Changed
- PODAAC-2393: Updated HiTIDE UI Deployment Pipeline

### Removed
### Fixed
- PODAAC-2625: Fixed links to dataset portal pages
