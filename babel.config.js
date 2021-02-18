module.exports = {
 presets: [
  [
   '@babel/preset-env',
   {
    targets: {
     node: 'current',
    },
   },
  ],
 ],
 plugins: [
  [
   'module-resolver',
   {
    alias: {
     controllers: './src/controllers',
     models: './src/models',
     routes: './src/routes',
     seeders: './src/seeders',
     utils: './src/utils',
     config: './src/config',
     services: './src/services',
     middlewares: './src/middlewares',
     validations: './src/validations',
    },
   },
  ],
 ],
};
