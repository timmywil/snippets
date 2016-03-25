angular.module("gc.reservations", [
  "gc.reservations.support"
  "gc.reservations.domain"
  "gc.reservations.components"
  "ui.router"
  "angularPayments"
  "gc-app"
#  "gc-shift-notes" # Disabling until we actually use it
  "ngAnimate"
  "fiestah.money"
  "gc-passcode"
])

.config ($httpProvider)->
  $httpProvider.useApplyAsync(true)
  $httpProvider.interceptors.push("OfflineInterceptor")
  $httpProvider.interceptors.push("ErrorInterceptor")

  if !$httpProvider.defaults.headers.get then $httpProvider.defaults.headers.get = {}
  $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache'
  $httpProvider.defaults.headers.get['Pragma'] = 'no-cache'

.config ($provide) ->
  $provide.decorator '$exceptionHandler', ($delegate, $window) ->
    (exception, cause) ->
      if $window.trackJs
        $window.trackJs.track exception
      # (Optional) Pass the error through to the delegate formats it for the console
      $delegate exception, cause
      return
  return

.run (AppStartupActions, $animate)->
  # $animate.enabled(false)
  AppStartupActions.start()

  # a = document.createElement("script")
  # a.src = "https://rawgithub.com/kentcdodds/ng-stats/master/src/ng-stats.js"
  # a.onload = -> window.showAngularStats(position:"topright")
  # document.head.appendChild(a)

angular.module "gc.reservations.support", ["gc-app"]
angular.module "gc.reservations.domain", ["gc-app", "gc.reservations.support", "ui.router"]
angular.module "gc.reservations.components", ["gc.reservations.domain", "ngSanitize", "gui-checkbox-control"]  # Add "gc-shift-notes" when turning it on
