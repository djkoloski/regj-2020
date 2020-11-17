const execSync = require('child_process').execSync
const fs = require('fs')
const gulp = require('gulp')
const path = require('path')
const webpack = require('webpack')

const buildDev = path.resolve(__dirname, 'build/dev')
const buildProd = path.resolve(__dirname, 'build/prod')

function generateBackendKeys (dir) {
  const caSubject = '/C=US/ST=NY/O=Development CA/CN=Development Root CA'
  const subject = '/C=US/ST=NY/O=Development/CN=localhost'

  const opensslPath = path.resolve(__dirname, 'tools/openssl/openssl.exe')
  const opensslCnf = path.resolve(__dirname, 'tools/openssl/openssl.cnf')
  const opensslConfig = path.resolve(__dirname, 'openssl.config')

  const caKeyPath = path.resolve(dir, 'ca_privkey.pem')
  const caCertPath = path.resolve(dir, 'ca_cert.pem')
  const keyPath = path.resolve(dir, 'privkey.pem')
  const serverCsrPath = path.resolve(dir, 'server.csr')
  const certPath = path.resolve(dir, 'cert.pem')

  if (!fs.existsSync(caKeyPath) || !fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
    execSync(`"${opensslPath}" genrsa -out "${caKeyPath}" 4096`)
    execSync(`"${opensslPath}" req -config "${opensslCnf}" -new -x509 -days 3650 -key "${caKeyPath}" -subj "${caSubject}" -out "${caCertPath}"`)
    execSync(`"${opensslPath}" req -config "${opensslCnf}" -newkey rsa:4096 -nodes -sha256 -keyout "${keyPath}" -subj "${subject}" -out "${serverCsrPath}"`)
    execSync(`"${opensslPath}" x509 -req -sha256 -extfile "${opensslConfig}" -days 3650 -CA "${caCertPath}" -CAkey "${caKeyPath}" -CAcreateserial -in "${serverCsrPath}" -out "${certPath}"`)

    fs.unlinkSync(caCertPath)
    fs.unlinkSync(serverCsrPath)
  }
}

gulp.task('generate-backend-keys-dev', (done) => {
  generateBackendKeys(buildDev)
  done()
})

function createWebpackCompiler (dir, mode) {
  const config = {
    entry: path.resolve(__dirname, 'frontend/app.js'),
    mode: mode,
    output: {
      filename: 'app.js',
      path: path.resolve(dir, 'public')
    }
  }
  if (mode === 'development') {
    config.devtool = 'inline-source-map'
  } else {
    config.plugins.push(new OptimizeCssAssetsPlugin())
  }
  return webpack(config)
}

function webpackFrontend (dir, mode, done) {
  createWebpackCompiler(dir, mode).run(done)
}

function webpackFrontendWatch (dir, mode, done) {
  createWebpackCompiler(dir, mode).watch({
    aggregateTimeout: 300,
    poll: undefined
  }, (err, stats) => {
    if (err) {
      console.log(err)
      done()
    }
    console.log(stats.toString({ colors: true }))
  })
}

gulp.task('webpack-dev', (done) => {
  webpackFrontendWatch(buildDev, 'development', done)
})

gulp.task('webpack-prod', (done) => {
  webpackFrontend(buildProd, 'production', done)
})

const staticFiles = ['static/**/*', 'static/**/.*']

function copyStatic (dir) {
  return gulp.src(staticFiles).pipe(gulp.dest(dir))
}

gulp.task('copy-static-dev', () => {
  return copyStatic(buildDev)
})

gulp.task('watch-static-dev', () => {
  gulp.watch(staticFiles, { ignoreInitial: false }, gulp.series('copy-static-dev'))
})

gulp.task('copy-static-prod', () => {
  return copyStatic(buildProd)
})

gulp.task('build-backend-prod', (done) => {
  execSync('wsl ~/.cargo/bin/cargo build --target=x86_64-unknown-linux-gnu --release')
  fs.copyFileSync(path.resolve(__dirname, 'target/x86_64-unknown-linux-gnu/release/backend'), path.resolve(buildProd, 'backend'))
  done()
})

gulp.task('create-build-directory-dev', (done) => {
  fs.mkdirSync(buildDev, { recursive: true })
  done()
})

gulp.task('create-build-directory-prod', (done) => {
  fs.mkdirSync(buildProd, { recursive: true })
  done()
})

gulp.task('dev', gulp.series('create-build-directory-dev', gulp.parallel('generate-backend-keys-dev', 'webpack-dev', 'watch-static-dev')))

gulp.task('prod', gulp.series('create-build-directory-prod', gulp.parallel('webpack-prod', 'copy-static-prod', 'build-backend-prod')))
