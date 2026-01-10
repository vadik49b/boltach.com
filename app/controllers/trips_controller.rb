class TripsController < ApplicationController
  def index
    @trips = Trip.order(entry_date: :desc)
  end

  def show
  end
end
