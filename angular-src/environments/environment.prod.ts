// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  secured: true,
  
  // In prod mode: config section is ignored and configServer must be an array of 
  // - environmental variables which will be fetched from the server
  configServer: ['API_ENDPOINT'],
  config: {}
};
