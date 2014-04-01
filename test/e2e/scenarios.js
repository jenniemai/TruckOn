describe('Food Truck App', function() {
 
  describe('List view', function() {
 
    beforeEach(function() {
      browser().navigateTo('../../index.html');
    });

    it('should render the food truck list', function() {
        browser().navigateTo('#/list');
      expect(repeater('.detail-row').count()).toBe(609);
 
      input('query1').enter('test');
      expect(repeater('.detail-row').count()).toBe(0);


      input('query1').enter('julie');

      expect(repeater('.detail-row').count()).toBe(2);

    });

    it('should render the food truck detail list on the map', function() {
        browser().navigateTo('#/map');
      expect(repeater('.map-detail-view .detail-table-header').count()).toBe(1);
 
      input('query').enter('test');
      expect(repeater('map-detail-view .detail-row').count()).toBe(0);


     expect(repeater('map-detail-view .detail-row').count()).toBe(2);

    });

  });
});
