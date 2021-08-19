# tag-match

Node based CLI that reads and match two sets of json records using their tags property.


## Setup

### Method 1: Via NPM


install using
```
npm i -g @nx915/tag-match
```


Launch program with
```
tag-match [options] FILEPATH_1 ... FILEPATH_N
```

### Method 2: Clone the repo


Clone repo from [here](https://github.com/NX915/tag-match "tag-match github repo link") then run
```
npm install
```


Launch program with
```
npm start [options] FILEPATH_1 ... FILEPATH_N
```


## Program Options

Parameter | Example | Description
--- | --- | ---
minMatch | `-1` | Default to 2 and must be the first parameter. Specifies the minimal number of tags to be considered a match

## Datafile Sample

### [users.json](https://raw.githubusercontent.com/NX915/tag-match/main/Data/users.json "sample users datafile link")

### [jobs.json](https://raw.githubusercontent.com/NX915/tag-match/main/Data/jobs.json "sample jobs datafile link")
