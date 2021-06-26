const Campground = require('../models/campground')
const Comment = require('../models/comment')
const {Client} = require('@googlemaps/google-maps-services-js')
const {GAPI_GEO_ENCODER_KEY} = require('../conf/env')

exports.redirectIfNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Please Login first')
        return res.redirect('back')
    }
    next()
}

exports.redirectIfLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.flash('error', 'Already Logged In')
        return res.redirect('back')
    }
    next()
}

exports.getUser = (req, res, next) => {
    res.locals.user = req.user
    next()
}

exports.getFlashMessage = (req, res, next) => {
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')
    next()
}

exports.assertCampgroundOwner = async (req, res, next) => {
    try {
        const campground = await Campground.findById(req.params.id)
        if (!campground.author.id.equals(req.user._id)) {
            req.flash('error', 'You don\'t have permission to do that')
            return res.redirect('back')
        }
        res.locals.campground = campground
        next()
    } catch (e) {
        console.log(e)
        req.flash('error', 'Cannot find campground')
        res.redirect('back')
    }
}

exports.assertCommentOwner = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId)
        if (!comment) {
            req.flash('error', 'Comment not found')
            return res.redirect('back')
        }
        if (!comment.author.id.equals(req.user._id)) {
            req.flash('error', 'You don\'t have permission to do that')
            return res.redirect('back')
        }
        res.locals.comment = comment
        next()
    } catch (e) {
        console.log(e)
        req.flash('error', 'Comment not found')
        res.redirect('back')
    }
}

exports.assertCampgroundExists = async (req, res, next) => {
    try {
        const campgroundId = req.params.id
        const campground = await Campground.findById(campgroundId)
        if (!campground) {
            req.flash('error', 'Campground not found')
            return res.redirect('back')
        }
        res.locals.campground = campground
        next()
    } catch (e) {
        console.log(e)
        req.flash('error', 'Campground not found')
        res.redirect('back')
    }
}

exports.getLocation = async (req, res, next) => {
    try {
        const client = new Client({})
        const geocodeResponse = await client.geocode({
            params: {
                address: req.body.location,
                key: GAPI_GEO_ENCODER_KEY
            }
        })
        const {lat, lng} = geocodeResponse.data.results[0].geometry.location
        const {formatted_address} = geocodeResponse.data.results[0].formatted_address
        res.locals.location = formatted_address
        res.locals.lat = lat
        res.locals.lng = lng
        next()
    } catch (e) {
        console.log(e)
        req.flash('error', 'Cannot find the location')
        res.redirect('back')
    }
}


const j = {
    "results" : [
        {
            "address_components" : [
                {
                    "long_name" : "1600",
                    "short_name" : "1600",
                    "types" : [ "street_number" ]
                },
                {
                    "long_name" : "Amphitheatre Pkwy",
                    "short_name" : "Amphitheatre Pkwy",
                    "types" : [ "route" ]
                },
                {
                    "long_name" : "Mountain View",
                    "short_name" : "Mountain View",
                    "types" : [ "locality", "political" ]
                },
                {
                    "long_name" : "Santa Clara County",
                    "short_name" : "Santa Clara County",
                    "types" : [ "administrative_area_level_2", "political" ]
                },
                {
                    "long_name" : "California",
                    "short_name" : "CA",
                    "types" : [ "administrative_area_level_1", "political" ]
                },
                {
                    "long_name" : "United States",
                    "short_name" : "US",
                    "types" : [ "country", "political" ]
                },
                {
                    "long_name" : "94043",
                    "short_name" : "94043",
                    "types" : [ "postal_code" ]
                }
            ],
            "formatted_address" : "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA",
            "geometry" : {
                "location" : {
                    "lat" : 37.4224764,
                    "lng" : -122.0842499
                },
                "location_type" : "ROOFTOP",
                "viewport" : {
                    "northeast" : {
                        "lat" : 37.4238253802915,
                        "lng" : -122.0829009197085
                    },
                    "southwest" : {
                        "lat" : 37.4211274197085,
                        "lng" : -122.0855988802915
                    }
                }
            },
            "place_id" : "ChIJ2eUgeAK6j4ARbn5u_wAGqWA",
            "plus_code": {
                "compound_code": "CWC8+W5 Mountain View, California, United States",
                "global_code": "849VCWC8+W5"
            },
            "types" : [ "street_address" ]
        }
    ],
    "status" : "OK"
}
