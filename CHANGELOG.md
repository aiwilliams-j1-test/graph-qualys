# Changelog

## [Unreleased]

## 5.4.2 - 2021-04-20

### Fixed

- #101 Fixed error handling host details with `os.toLowerCase not a function`

## 5.4.1 - 2021-04-20

### Added

- Added support for host asset tags returned as `tags.TAG[]`.
- Added lots more tests for tags processing.

### Fixed

- Fixed bug where EC2 tags would overwrite `host.tags` values when they had the
  same name.

- Fix bug where `Host.tags` could be an `object` and fail to validate uploads to
  J1. The code will set `Host.tags = 'INVALID'` when it cannot resolve the tags.
  Please let us know if you find this value in your `Host.tags`, we may need
  your help to see what Qualys APIs return for your data.

## 5.4.0 - 2021-04-19

### Changed

- Added additional properties to `discovered_host` `Host` mapped entities:

  - `tags`: Simple Qualys asset tag values (i.e. `tags: ["Cloud Agent"]`)

- Added additional properties to `aws_instance` `Host` mapped entities:

  - `tag.*`: Named tag properties from EC2 instance (i.e. `tag.Owner = "value"`)
  - `tags`: Simple Qualys asset tag values (i.e. `tags: ["Cloud Agent"]`)
  - `qualysFirstDiscoveredOn`
  - `qualysLastUpdatedOn`
  - `accountId`
  - `region`
  - `state`
  - `reservationId`
  - `availabilityZone`
  - `subnetId`
  - `vpcId`
  - `instanceId`
  - `instanceType`
  - `imageId`
  - `privateDnsName`
  - `publicDnsName`
  - `publicIpAddress`

- Added `Vulnerability.qid` to support mapping
  `TheatIntel.vulnId === Vulnerability.qid`. Note that `ThreatIntel.vulnId` must
  be of type `number` for the mapping to function.

  A Qualys detection may be associated with many CVEs. These detections become
  entities having
  `{ _class: 'Vulnerability', _type: 'cve', id: 'CVE-ID-HERE', qid: 123456 }`.
  When there are no CVEs associated with the detection, entities are produced as
  `{ _class: 'Vulnerability', _type: 'qualys_vuln', id: '123456', qid: 123456 }`.
  All `id` properties are intended to be String values; `qid` is a number to
  reflect the type of the value from the source, supporting queries such as
  `find Vulnerabilty with qid=123456`.

### Fixed

- Fixed missing `_key` on `aws_instance` `Host` mapped entities.

## 5.3.1 - 2021-03-31

### Changed

- The value of the Qualys `HostAsset.fqdn` is now normalized with
  `toLowerCase()`. The value is stored in `Finding.targets` and as `Host.fqdn`.
  This supports mapping rules that work by finding matching values.

## 5.3.0 - 2021-02-17

### Changed

- Host `Finding.targets` has been adjusted to include only
  `[detection.HOST.IP, assetHost.fqdn, assetHost.ec2InstanceArn]`. At this time,
  only `fqdn` and `ec2InstanceArn` will be used for mapping to the `Host`
  entity.

### Added

- Host `Finding` entities now has properties `fqdn`, `ec2InstanceArn`. These are
  used to map the `Finding` to the `Host` entities, which may be owned by other
  integrations (such as AWS).

## 5.2.1 - 2021-02-05

- Adjusted host details fetch settings:
  - Page size `2000` -> `250`
  - Request concurrency `10` -> `5`
  - Timeout `10` -> `5` minutes

## 5.2.0 - 2021-01-19

### Changed

- Adjusted host details fetch settings:
  - Page size `250` -> `2000`
  - Request concurrency `10` -> `5`
  - Timeout `5` -> `8` minutes

### Fixed

- Fixed bug in QID -> finding key tracking that kept the program from
  associating all findings to their vulnerabilities

## 5.1.0 - 2021-01-14

### Changed

- Fetching knowledge base vulnerabilities using concurrency headers from Qualys
  server responses
- Mock Qualys server enforces concurrency limits in vulnerabilities endpoint
- Mock Qualys server answers vulnerabilities that have CVEs and some that don't
- Enable ingestion of Finding - IS -> Vulnerability mapped relationships

## 5.0.4 - 2021-01-05

### Added

- Mock Qualys server prevents exceeding detections endpoint concurrency limit,
  answers `409` response when exceeded
- Mock Qualys server allows simulating additional number of concurrent requests
  that belong to other scripts, to assist testing concurrency code

### Changed

- Disable receiving the `RESULTS` field from the Qualys host detections response

### Fixed

- Fixed bug in concurrency calculation that allowed too many active requests
- Fixed bug in detecting concurrency limit exceeded Qualys API response

## 5.0.3 - 2021-01-04

### Fixed

- Detections request concurrency incorrectly calculated, reducing number of
  active requests

## 5.0.2 - 2021-01-03

### Changed

- Mock Qualys server data generator may be configured to emit exact numbers of
  hosts and total detections across all hosts
- XML data for detections sometimes contain `DETECTION.QID` values such as:

  ```js
  '{"#text":"o��t�","��\u001dX�Ď��,</QID":{"TYPE":"Info","FIRST_FOUND_DATETIME":"2020-12-30T03:44:04Z","LAST_FOUND_DATETIME":"2020-12-30T03:44:04Z","TIMES_FOUND":1,"IS_DISABLED":0,"LAST_PROCESSED_DATETIME":"2020-12-30T03:44:35Z"},"DETECTION":[{"QID":"��\u001b�\u001c�\u0002$�{\b����#","TYPE":"Info","FIRST_FOUND_DATETIME":"2020-12-30T03:44:04Z","LAST_FOUND_DATETIME":"2020-12-30T03:44:04Z","TIMES_FOUND":1,"IS_DISABLED":0,"LAST_PROCESSED_DATETIME":"2020-12-30T03:44:35Z"},{"QID":"�4P��H����\n�V�\u0019","TYPE":"Info","FIRST_FOUND_DATETIME":"2020-12-30T03:44:04Z","LAST_FOUND_DATETIME":"2020-12-30T03:44:04Z","TIMES_FOUND":1,"IS_DISABLED":0,"LAST_PROCESSED_DATETIME":"2020-12-30T03:44:35Z"},{"QID":"�����\u000e\u0010�R\u000bq�U!�","TYPE":"Info","FIRST_FOUND_DATETIME":"2020-12-30T03:44:04Z","LAST_FOUND_DATETIME":"2020-12-30T03:44:04Z","TIMES_FOUND":1,"IS_DISABLED":0,"LAST_PROCESSED_DATETIME":"2020-12-30T03:44:35Z"},{"QID":":u��GĹ�K_���\u001d�","TYPE":"Info","FIRST_FOUND_DATETIME":"2020-12-30T03:44:04Z","LAST_FOUND_DATETIME":"2020-12-30T03:44:04Z","TIMES_FOUND":1,"IS_DISABLED":0,"LAST_PROCESSED_DATETIME":"2020-12-30T03:44:35Z"}]}';

  ```

  When `typeof QID !== 'number'`, the detection will be skipped and the number
  of times this occurrs is logged.

### Fixed

- Mock Qualys server host IDs endpoint answered invalid host ID values, leading
  to a failure to list detections

## 5.0.1 - 2021-01-02

### Changed

- Upgrade `@jupiterone/integration-sdk-\*@5.5.0`
- Removed empty raw data from Finding entities to avoid unecessary use of space
  (memory, data shipped, etc.)

## 5.0.0 - 2021-01-01

### Changed

- Mock Qualys server includes concurrency and rate limit headers to exercise
  concurrency logic in client
- Mock Qualys server answers a variable number of detections per host
- Mock Qualys server detections endpoint response times vary across invocations
  to simulate production variation
- Mock Qualys server generates hosts with different IDs so that subsequent
  starts will produce overlapping ranges, to simulate getting different scanned
  hosts across executions
- Upgrade `@jupiterone/integration-sdk-*@5.4.0`
- Using new `JobState.hasKey()` in place of tracking integration had to do to
  detect generating duplicate Findings, to save memory for long running
  instances
- Disable Service - IDENTIFIED -> Finding relationships temporarily

### Fixed

- Duplicate values in `Finding.targets` are removed
- Memory leak in SDK impacting long running instances

## 4.8.0 - 2020-12-27

### Changed

- Upgrade `@jupiterone/integration-sdk-\*@5.3.0`
- Adopted `indexMetadata` in each step's graph object metadata to omit disk
  writes
- Reduce frequency of host detection logging

## 4.7.5 - 2020-12-22

### Changed

- Request details for more hosts per request, submit more requests concurrently
  to reduce total time to fetch large numbers of hosts.

### Added

- `yarn start:qualys` provides a mock implementation of some of the Qualys APIs
  used by the integration.

## 4.7.4 - 2020-12-21

### Changed

- Validating response content type before parsing body
- Upgraded various packages and removed old unused packages

## 4.7.3 - 2020-12-05

### Fixed

- Fixed error `os.toLowerCase is not a function` when processing host details

### Added

- Logging each host detection count during iteration
- Better handling of memory by dropping XML string after conversion

## 4.7.2 - 2020-12-05

### Fixed

- Responses with large bodies would hang the program

### Added

- Additional Qualys API response error handling

## 4.7.1 - 2020-12-03

### Fixed

- Configuration validation fails to log some details for invalid configuration

## 4.7.0 - 2020-12-03

### Changed

- Upgrade `@jupiterone/integration-sdk-*@5.0.0`
- Limit processing to hosts scanned up to the start time of the current
  execution. This helps to avoid an overlap between executions.

## 4.6.1 - 2020-11-23

### Fixed

- Integration retries errors that should be skipped

## 4.6.0 - 2020-11-23

### Changed

- Upgrade `@jupiterone/integration-sdk-*@4.2.0`
- `context.history` is used to ingest scans/findings since last successful
  execution
- Mark apps, hosts, and findings as partial data sets so that previous findings
  are not deleted during synchronization

### Fixed

- Integration does not detect expired trial accounts

## 4.5.0 - 2020-10-29

### Added

- Configuration check that the api url starts with qualysapi

## 4.4.0 - 2020-10-29

### Changed

- Upgrade `@jupiterone/integration-sdk-*@4.0.0`

## 4.3.1 2020-10-20

### Fixed

- Avoid `fetchScannedHostDetails` step failure when no hosts found
- Avoid `fetchScannedHostFindings` step failure when no hosts found, or when
  details could not be loaded for hosts

## 4.3.0 2020-10-20

### Added

- Job event log `stats` entries to provide some count information
- Handle failure to fetch a page of web app findings (timeout, max retries)
- Handle failure to fetch a page of host details (timeout, max retries)
- Integration instance config `minScannedSinceDays` to control how far back to
  find scanned web apps and hosts, limiting findings to these apps/hosts
- Integration instance config `minFindingsSinceDays` to control how far back to
  find scanned web app findings and host detections
- Allow passing in `MIN_FINDINGS_SINCE_DAYS` environment variable that is used
  to custom configure a date range for debugging

### Changed

- Additional logging per API request to ensure paginated requests are advancing
  through large sets of data
- Add concurrency mechanism for web app findings requests
- Add concurrency mechanism for host detail requests
- Add concurrency mechanism for host detections requests
- Set 5 minute timeout on host details and web app findings page requests
- Renamed `VM_SCAN_SINCE_DAYS` to `MIN_SCANNED_SINCE_DAYS`
- Removed used of `...convertProperties` when creating `Finding` entities to
  avoid excessive amounts of data that are not defined by the data model and are
  often rejected by J1 for size limits
- `Finding.open` is set by checking for `!fixed` status
- Do not retry `404` responses

### Fixed

- Missing `Application.displayName` for `web_app` entities
- Duplicate key for `Finding - IS -> Vulnerability` relationships
- Duplicate key for `Service - SCANS -> Host` relationships
- Error converting Host `os` property when it is not a string (the type
  advertised in the docs)
- Syntax error in `getTargetsForDetectionHost` cause step to fail
- All host details and detections added to raw data of every host Finding entity
- Pagination of web app findings
- Generation of XML filters for web app API requests
- Handle non-rate limit `409` responses and report reason for not retrying

## 4.2.5 2020-10-12

### Fixed

- Switch host detections and details page size to `1000`.

## 4.2.4 2020-10-12

### Changed

- `responseErrorDetails` was an object, going to log the response text on error
  for list host details to be sure we get details.

## 4.2.3 2020-10-12

### Added

- `responseErrorDetails` when receiving an error response for host asset
  listing.
- Logging of host IDs data type.

## 4.2.2 2020-10-12

### Changed

- Allow passing in `VM_SCAN_SINCE_DAYS` environment variable that is used to
  custom configure a date range for debugging.

## 4.2.1 2020-10-12

### Fixed

- Fix `vm_scan_since` to remove milliseconds, which produced a bad request
  response from Qualys.

## 4.2.0 2020-10-11

### Added

- `iterateScannedHostIds` options now supports
  `{ filters: { vm_scan_since: <ISO date> } }` to limit to hosts that have been
  scanned since a date/time.

### Changed

- `STEP_FETCH_SCANNED_HOST_IDS` limits to hosts scanned since 30 days ago.
- `iterateScannedHostIds` options changed from `{ pageSize }` to
  `{ filters: {}, pagination: { limit: number } }`.
- `iterateHostDetails` options changed from `{ pageSize }` to
  `{ pagination: { limit: number } }`.
- `iterateHostDetections` options changed from `{ pageSize }` to
  `{ pagination: { limit: number } }`.
- `iterateVulnerabilities` options changed from `{ pageSize }` to
  `{ pagination: { limit: number } }`.

## 4.1.3 2020-10-11

- `iterateScannedHostIds` defaults to requesting 10,000 IDs per page
- `iterateHostDetails` defaults to requesting details for 2,500 hosts per page
- `iterateHostDetections` defaults to requesting detections for 2,500 hosts per
  page

## 4.1.2 2020-10-11

### Changed

- `iterateScannedHostIds` defaults to requesting 5000 IDs per page
- `iterateHostDetails` now supports `options?: { pageSize }` and defaults to
  requesting details for 1000 hosts per page
- `iterateHostDetections` now supports `options?: { pageSize }` and defaults to
  requesting detections for 1000 hosts per page
- `iterateVulnerabilities` now supports `options?: { pageSize }` and defaults to
  requesting 1000 vulnerabilities per page

## 4.1.1 2020-10-10

### Fixed

- Fixed pagination request URL to avoid prepending that produced
  `https://qualysapi.qualys.comhttps://qualysapi.qualys.com/api/2.0/fo/asset/host/`

## 4.1.0 2020-10-10

### Added

- `iterateScannedHostIds` to allow for paginating requests for scanned host IDs.

### Fixed

- `fetchScannedHostIds` when there is more than a single host in the list.

### Changed

- `STEP_FETCH_SCANNED_HOST_IDS` now uses `iterateScannedHostIds` and issues
  `logger.info` with an updated total count of seen IDs.

## 4.0.0 2020-10-09

This is a significant change to the program structure to be sure, but also makes
significant changes to the generated graph to move to the documented
vulnerability
[findings model](https://support.jupiterone.io/hc/en-us/articles/360041429733-Data-Model-for-Vulnerability-Management).

### Changed

- Break ingestion into multiple steps.
- Adopt pattern of `iterateResources` in provider client code.
- Ensure exceptions are handled and retries performed in all APIs.
- Use rate limit response headers from VMDR API to throttle client, avoiding
  unneccessary retries.
- Add basic handling of concurrency response headers by waiting for a bit before
  retrying.
- Create an `Account` entity.
- Create a `Service` entity for VMDR, WAS, relate them to `Account`.
- Add `function` to `Service` entities.
- Create a mapped relationship
  `Service - SCANS -> {_class: 'Host', _type: 'aws_instance', _key: '<instance arn>', id: [<instanceId>, <hostAssetId>, <qwebHostId>]`
  to relate to existing entities and allow for entity adoption when the AWS
  integration runs.
- Create a mapped relationship
  `Service - SCANS -> {_class: 'Host', _type: 'discovered_host', _key: 'qualys-host:<qwebHostId>', id: [<hostAssetId>, <qwebHostId>]`
  to cause the mapper to create the entity.
- Collect raw data on `Finding` entities.
- Create direct relationship `Service - IDENTIFIED -> Finding`.
- Rely on global mapping for `Finding <- HAS - Host`. This depends on
  `Finding.targets` including `Host.id` values (hostAssetId, qwebHostId).
- Create a mapped relationship
  `Finding - IS -> {_class: 'Vulnerability', _type: 'cve', _key: '<cve.id>'` for
  each CVE in the vulnerability. This will relate the `Finding` to the global
  `cve` entities that all scanner integrations reference.
- Create a mapped relationship `Service - SCANS -> WebApp`.
- Ingest wep app `Finding`, including values in `targets` to allow global
  mappings to function.
- Normalize `Finding.numericSeverity` to a range of 1-10 on web app and host
  `Finding` entities to match data model.
- Use `informational` instead of `info` for `Finding.severity`.
- Process unexpected severity values: <= 0 are `informational`, >= 5 are
  `critical`.
- Add `publicIpAddress`, `privateIpAddress` to `Host` entities.

## 3.1.0 2020-09-25

### Changed

- Added a lot more logging
- Various changes attempting to limit amount of data ingested

### Fixed

- A few unhandled promises

## 3.0.3 2020-09-16

### Changed

- Add more request logging
- Checked for no `lastId` in determining whether there is another page

## 3.0.2 2020-09-15

### Changed

- Allow 60 seconds for responses
- Bump web app scan request concurrency to 3

## 3.0.1 2020-09-15

### Changed

- Retry fetch errors up to 10 times
- Limit web app scan request concurrency to 1

## 3.0.0 2020-09-10

### Changed

- Update to `@jupiterone/integration-sdk-*@3.2.0`
- Setup instructions to help get a Qualys trial going

## 2.2.0 2020-06-29

### Changed

- Update to `@jupiterone/integration-sdk-*@2.2.0`

## 2.1.0 2020-06-09

### Fixed

- Package build

## 2.0.0 2020-06-08

### Changed

- Update to `@jupiterone/integration-sdk-*@1.1.0`
- Add `husky.config.js` to get hooks working

## 1.2.2 2020-05-20

### Changed

- `Finding._key` generation and checking for duplicates

## 1.2.1 2020-05-20

- Better error handling

## 1.0.2 2020-05-05

### Added

- Add tooling for running fake Qualys knowledge base server
- Add documentation for configuring `.env` file
- Add additional logging if API requests return no results
- Add additional logging if licensing restriction does not allow access to
  knowledge base

## 1.0.1

- Initial version for development and testing
