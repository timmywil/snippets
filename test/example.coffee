angular.module("gc.reservations.domain")

.factory "BaseStreamService", (CursorAdapters, SyncProxy, AppContext, $rootScope, SyncProxyResources, PollingHTTPService, ReservationsStorageService)->

  class BaseStreamService

    getType:()->

    getIdProperty:()->

    getCursorAdapter:()->
      CursorAdapters[@getType()]

    getVenueUrl:()->

    getVenueParams:()->

    getParams:()=>
      _.extend {}, @getVenueParams(), {
        sinceTimeStamp:@getCursorAdapter().getTimestamp()
      }

    getVenuePollingInterval:()->

    start:()->
      if SyncProxy.enabled
        @listenForSyncProxy()
      else
        @pollVenue()

    listenForSyncProxy:()->
      @syncListenKey = "#{SyncProxyResources.resourceIndex[@getType().toLowerCase()].uri}"
      $rootScope.$on @syncListenKey, (data, patches)=>
        console.log "received #{@getType()} broadcast", patches
        items = _.map patches, (patch)=>
          patch.body[@getIdProperty()] = patch.id if patch.id
          patch.body.Version = patch.version
          _.clone patch.body

        @store(items)

    pollVenue:()->
      pollingClass = PollingHTTPService.create(
        @getVenueUrl,
        @getParams,
        @getVenuePollingInterval
      )
      @httpService = new pollingClass(@)

      @httpService.start()

    store:(data)=>
      for item in data
        item.syncing = false
      ReservationsStorageService["store#{@getType()}"](data, true)
        .then ()=>
          @getCursorAdapter().save(data)
