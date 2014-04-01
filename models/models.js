//Data Models

exports.createFoodTruck= function(name, approved, permit, locations, description, facilityType) {

	var truckModel = new FoodTruck(name, approved, permit, locations, description, facilityType);
	return truckModel;
}

exports.createLocationSchedule= function(address, locationDescr, latitude, longitude) {

	var locationModel = new LocationSchedule(address, locationDescr, latitude, longitude);
	return locationModel;
}

exports.createErrorStatus = function(err) {
	return new ErrorStatus(err);
}


function FoodTruck(name, approved, permit, locations, description, facilityType) {

	//id
	this.name = name;
	this.approvedDate = approved;
	this.permit = permit;
	this.locations = locations;
    this.description = description;
    this.facilityType = facilityType;
}

//Locations, based on permits
function LocationSchedule(address, locationDescr, latitude, longitude)
{
	this.address = address;
	this.locationDescr = locationDescr;
	this.latitude = parseFloat(latitude);
	this.longitude = parseFloat(longitude);
	this.schedule = new Array();
	this.hasSeenSchedule = {};

}

LocationSchedule.prototype.update = function(schedule)
{
	if (!this.hasSeenSchedule[schedule.DayOrder])
	{
		this.schedule.push(new Schedule(schedule));
		this.hasSeenSchedule[schedule.DayOrder] = true;
	}
}

function Schedule(schedule)
{

	this.dayOrder = schedule.DayOrder;
	this.dayOfWeek = schedule.DayOfWeekStr;
	this.startTime = schedule.starttime;
	this.endTime = schedule.endtime;

}

function ErrorStatus(err)
{
	this.errorMessage = err;
	this.status = "ERROR";
}


