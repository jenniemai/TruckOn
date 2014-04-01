describe('Food Truck controller', function () {

        describe('controller', function () {

                var scope, ctrl, $httpBackend;

                beforeEach(module('foodTruckApp'));

                beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
                        $httpBackend = _$httpBackend_;
                        $httpBackend.expectGET('/foodtrucks/all').
                        respond([{
                            {
                                "name": "Cheese Gone Wild",
                                "approvedDate": "2014-03-13T12:25:46",
                                "permit": "14MFF-0035",
                                "locations": [{
                                    "address": "400 HOWARD ST",
                                    "locationDescr": "01ST ST: NATOMA ST to HOWARD ST (165 - 199)",
                                    "latitude": 37.7891192076677,
                                    "longitude": -122.395881039335,
                                    "schedule": [{
                                        "dayOrder": "2",
                                        "dayOfWeek": "Tuesday",
                                        "startTime": "10AM",
                                        "endTime": "3PM"
                                    }]
                                }],
                                "description": "Grilled Cheese Sandwiches",
                                "facilityType": "Truck",
                                "_id": "533946370665659d8a1d1302"
                            }, {
                                "name": "Senor Sisig",
                                "approvedDate": "2014-03-21T11:18:59",
                                "permit": "14MFF-0006",
                                "locations": [{
                                    "address": "120 02ND ST",
                                    "locationDescr": "02ND ST: MISSION ST to MINNA ST (100 - 130)",
                                    "latitude": 37.7875140607381,
                                    "longitude": -122.399566331429,
                                    "schedule": [{
                                        "dayOrder": "1",
                                        "dayOfWeek": "Monday",
                                        "startTime": "11AM",
                                        "endTime": "2PM"
                                    }, {
                                        "dayOrder": "5",
                                        "dayOfWeek": "Friday",
                                        "startTime": "11AM",
                                        "endTime": "2PM"
                                    }]
                                }],
                                "description": "Filipino fusion food: taco: burrito: nachos: rice plates",
                                "facilityType": "Truck",
                                "_id": "533946370665659d8a1d1307"
                            }, {
                                "name": "Bombay Blvd.",
                                "approvedDate": null,
                                "permit": "11MFF-0040",
                                "locations": [{
                                    "address": "86 03RD ST",
                                    "locationDescr": "03RD ST: JESSIE ST to MISSION ST (68 - 99)",
                                    "latitude": 37.7862060821039,
                                    "longitude": -122.402532491346,
                                    "schedule": [{
                                        "dayOrder": "0",
                                        "dayOfWeek": "Sunday",
                                        "startTime": "10AM",
                                        "endTime": "3PM"
                                    }, {
                                        "dayOrder": "5",
                                        "dayOfWeek": "Friday",
                                        "startTime": "10AM",
                                        "endTime": "3PM"
                                    }]
                                }],
                                "description": "Indian Style: BBQ: Variety of Curries: Rice: Wraps: Breads (Naan: Rotis: Parathas): Desserts: Pizza.  Beverages: Condiments: Indian Soups: Salads & Appetizer Varieties.",
                                "facilityType": "Truck",
                                "_id": "533946370665659d8a1d130c"
                            }
                        }]);

                            scope = $rootScope.$new();
                            ctrl = $controller('controller', {
                                $scope: scope
                            });
                        }));


                    it('should create "food truck" model with 3 food trucks fetched from xhr', function () {
                        expect(scope.foodTrucks).toBeUndefined();
                        $httpBackend.flush();

                        it('markers model should be the same number as foodtrucks models', function () {
                            expect(map.markers.length).toBe(3);
                        });
                    });
                });
});