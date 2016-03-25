const bind = (fn, me) => function() { return fn.apply(me, arguments) }

angular.module("gc.reservations.domain").factory("BaseStreamService", (
  CursorAdapters,
  SyncProxy,
  AppContext,
  $rootScope,
  SyncProxyResources,
  PollingHTTPService,
  ReservationsStorageService) => {
  let BaseStreamService
  return BaseStreamService = ((() => {
    class BaseStreamService {
      constructor() {
        this.store = bind(this.store, this)
        this.getParams = bind(this.getParams, this)
      }

      getType() {}
      getIdProperty() {}

      getCursorAdapter() {
        return CursorAdapters[this.getType()]
      }

      getVenueUrl() {}
      getVenueParams() {}

      getParams() {
        return _.extend({}, this.getVenueParams(), {
          sinceTimeStamp: this.getCursorAdapter().getTimestamp()
        })
      }

      getVenuePollingInterval() {}

      start() {
        if (SyncProxy.enabled) {
          return this.listenForSyncProxy()
        } else {
          return this.pollVenue()
        }
      }

      listenForSyncProxy() {
        this.syncListenKey = `${SyncProxyResources.resourceIndex[this.getType().toLowerCase()].uri}`
        return $rootScope.$on(this.syncListenKey, ((_this => (data, patches) => {
          let items
          console.log(`received ${_this.getType()} broadcast`, patches)
          items = _.map(patches, patch => {
            if (patch.id) {
              patch.body[_this.getIdProperty()] = patch.id
            }
            patch.body.Version = patch.version
            return _.clone(patch.body)
          })
          return _this.store(items)
        }))(this))
      }

      pollVenue() {
        let pollingClass
        pollingClass = PollingHTTPService.create(this.getVenueUrl, this.getParams, this.getVenuePollingInterval)
        this.httpService = new pollingClass(this)
        return this.httpService.start()
      }

      store(data) {
        let i, item, len
        for (i = 0, len = data.length; i < len; i++) {
          item = data[i]
          item.syncing = false
        }
        return ReservationsStorageService[`store${this.getType()}`](data, true).then(((_this => () => _this.getCursorAdapter().save(data)))(this))
      }
    }

    return BaseStreamService
  }))()
})
