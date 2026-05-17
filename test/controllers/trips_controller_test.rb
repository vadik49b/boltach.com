require "test_helper"

class TripsControllerTest < ActionDispatch::IntegrationTest
  setup do
    sign_in_as(users(:one))
  end

  test "should get index" do
    get travel_url
    assert_response :success
  end

  test "should get show" do
    get trip_url(trips(:one))
    assert_response :success
  end
end
