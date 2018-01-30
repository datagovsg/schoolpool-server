define({ "api": [
  {
    "type": "post",
    "url": "/generate-otp",
    "title": "Generate a OTP for a user",
    "name": "GenerateOTP",
    "group": "User",
    "deprecated": {
      "content": "There's no JWT authentication implemented yet"
    },
    "parameter": {
      "fields": {
        "Required Header": [
          {
            "group": "Required Header",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>JWT created from Auth0</p>"
          }
        ],
        "Required Param": [
          {
            "group": "Required Param",
            "type": "String",
            "optional": false,
            "field": "phoneNumber",
            "description": "<p>User's phone number</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>success message.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "IncompleteFormData",
            "description": "<p>An array of error's will be send</p>"
          },
          {
            "group": "Error 400",
            "optional": false,
            "field": "InvalidPhoneNumber",
            "description": "<p>This will be shown: <code>[&quot;Error : Phone number is invalid&quot;]</code></p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes/Users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/user/nearby",
    "title": "Get nearby user's",
    "name": "GetNearbyUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Required Header": [
          {
            "group": "Required Header",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>JWT created from Auth0</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "users",
            "description": "<p>Array of users data</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 401": [
          {
            "group": "Error 401",
            "optional": false,
            "field": "NoTokenFound",
            "description": "<p>This will be shown: <code>[&quot;Error : No token key present&quot;]</code></p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>This will be shown: <code>[&quot;Error : Registration failed&quot;]</code><br> this could cause due to having an invalid token</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes/Users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/user",
    "title": "Get current user",
    "name": "GetUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Required Header": [
          {
            "group": "Required Header",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>JWT created from Auth0</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "User.id",
            "description": "<p>User's Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "User.name",
            "description": "<p>User's name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "User.address",
            "description": "<p>User's house postal code..</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "User.latlong",
            "description": "<p>User's house in latitude and Longitude.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "User.phoneNumber",
            "description": "<p>User's Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "User.pairedId",
            "description": "<p>User's paired parent Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "User.profileURL",
            "description": "<p>User's profile picture URL.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "User.schoolAddress",
            "description": "<p>User's children school postal code.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 401": [
          {
            "group": "Error 401",
            "optional": false,
            "field": "NoTokenFound",
            "description": "<p>This will be shown: <code>[&quot;Error : No token key present&quot;]</code></p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>This will be shown: <code>[&quot;Error : Registration failed&quot;]</code><br> this could cause due to having an invalid token</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes/Users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/user/:userId",
    "title": "Get single user",
    "name": "GetUserById",
    "group": "User",
    "parameter": {
      "fields": {
        "Required URL Param": [
          {
            "group": "Required URL Param",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>Id of the User you want to view</p>"
          }
        ],
        "Required Header": [
          {
            "group": "Required Header",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>JWT created from Auth0</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "User.id",
            "description": "<p>User's Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "User.name",
            "description": "<p>User's name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "User.address",
            "description": "<p>User's house postal code..</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "User.latlong",
            "description": "<p>User's house in latitude and Longitude.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "User.phoneNumber",
            "description": "<p>User's Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "User.pairedId",
            "description": "<p>User's paired parent Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "User.profileURL",
            "description": "<p>User's profile picture URL.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "User.schoolAddress",
            "description": "<p>User's children school postal code.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 401": [
          {
            "group": "Error 401",
            "optional": false,
            "field": "NoTokenFound",
            "description": "<p>This will be shown: <code>[&quot;Error : No token key present&quot;]</code></p>"
          },
          {
            "group": "Error 401",
            "optional": false,
            "field": "NoUserFound",
            "description": "<p>This will be shown: <code>[&quot;User doesn't exist in database&quot;]</code></p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>This will be shown: <code>[&quot;Error : Registration failed&quot;]</code><br> this could cause due to having an invalid token</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes/Users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/user",
    "title": "Register a single user",
    "name": "PostUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Required Header": [
          {
            "group": "Required Header",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>JWT created from Auth0</p>"
          }
        ],
        "Required Param": [
          {
            "group": "Required Param",
            "type": "String",
            "optional": false,
            "field": "phoneNumber",
            "description": "<p>User's phone number</p>"
          },
          {
            "group": "Required Param",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>User's name</p>"
          },
          {
            "group": "Required Param",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>User's house postal code</p>"
          },
          {
            "group": "Required Param",
            "type": "String",
            "optional": false,
            "field": "longitude",
            "description": "<p>User's house logitude</p>"
          },
          {
            "group": "Required Param",
            "type": "String",
            "optional": false,
            "field": "latitude",
            "description": "<p>User's house latitude</p>"
          },
          {
            "group": "Required Param",
            "type": "Array",
            "optional": false,
            "field": "schoolAddress",
            "description": "<p>User's children postal code</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>success message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>User's Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>User's name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>User's house postal code..</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "latlong",
            "description": "<p>User's house in latitude and Longitude.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "phoneNumber",
            "description": "<p>User's Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "pairedId",
            "description": "<p>User's paired parent Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's email.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "profileURL",
            "description": "<p>User's profile picture URL.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "schoolAddress",
            "description": "<p>User's children school postal code.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "IncompleteFormData",
            "description": "<p>An array of error's will be send</p>"
          },
          {
            "group": "Error 400",
            "optional": false,
            "field": "InvalidPhoneNumber",
            "description": "<p>This will be shown: <code>[&quot;Error : Phone number is invalid&quot;]</code></p>"
          },
          {
            "group": "Error 400",
            "optional": false,
            "field": "NoTokenFound",
            "description": "<p>This will be shown: <code>[&quot;Error : No token key present&quot;]</code></p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>This will be shown: <code>[&quot;Error : Registration failed&quot;]</code><br> this could cause due to having an invalid token</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes/Users.js",
    "groupTitle": "User"
  },
  {
    "type": "put",
    "url": "/user",
    "title": "Update a single user",
    "name": "PutUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Required Header": [
          {
            "group": "Required Header",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>JWT created from Auth0</p>"
          }
        ],
        "Required Param": [
          {
            "group": "Required Param",
            "type": "String",
            "optional": false,
            "field": "phoneNumber",
            "description": "<p>User's phone number</p>"
          },
          {
            "group": "Required Param",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>User's name</p>"
          },
          {
            "group": "Required Param",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>User's house postal code</p>"
          },
          {
            "group": "Required Param",
            "type": "String",
            "optional": false,
            "field": "longitude",
            "description": "<p>User's house logitude</p>"
          },
          {
            "group": "Required Param",
            "type": "String",
            "optional": false,
            "field": "latitude",
            "description": "<p>User's house latitude</p>"
          },
          {
            "group": "Required Param",
            "type": "Array",
            "optional": false,
            "field": "schoolAddress",
            "description": "<p>User's children postal code</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>success message.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>User's Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>User's name.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "address",
            "description": "<p>User's house postal code..</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "latlong",
            "description": "<p>User's house in latitude and Longitude.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "phoneNumber",
            "description": "<p>User's Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "pairedId",
            "description": "<p>User's paired parent Id.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's email.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "profileURL",
            "description": "<p>User's profile picture URL.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "schoolAddress",
            "description": "<p>User's children school postal code.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "IncompleteFormData",
            "description": "<p>An array of error's will be send</p>"
          },
          {
            "group": "Error 400",
            "optional": false,
            "field": "NoTokenFound",
            "description": "<p>This will be shown: <code>[&quot;Error : No token key present&quot;]</code></p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "InternalServerError",
            "description": "<p>This will be shown: <code>[&quot;Error : Registration failed&quot;]</code><br> this could cause due to having an invalid token</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "./routes/Users.js",
    "groupTitle": "User"
  }
] });
