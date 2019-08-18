# Offices
Endpoints to manage office appointments. 

**NOTE:** *This is some basic documentation. For sure it needs more work, and a better implementation of the endpoints. If this tool is useful, I'll improve it with time, if not, it will stay like this forever. I made this in just a few days*

## Manage appointments from offices [/offices]
Endpoint to manage appointment from different offices.

### Retrieve all offices with appointments [GET]

+ Response 200 (application/json)
    + Body

    ```json
    [
        {
            "office": {
                "code": "103",
                "label": "Ceuta"
            },
            "datesAvailable": [
                "21/11/2019",
                "22/11/2019",
                "26/11/2019",
                "27/11/2019",
                "28/11/2019"
            ],
            "isAppointmentAvailable": true
        },
        {
            "office": {
                "code": "23",
                "label": "Malaga"
            },
            "datesAvailable": [
                "21/11/2019"
            ],
            "isAppointmentAvailable": true
        }
        // ...
    ]
    ```


**NOTE:** *This endpoint makes a lot of requests. To check if there is an appointment, there will be 6 request per office. There are 67 offices. So a total of **402 requests***


### Create appointments from a list of users [POST]

+ response 200 (application/json)
    + Body

    ```json
    [
        "office": {
            "code": "103",
            "label": "Ceuta"
        },
        "time": "10:00",
        "date": "25/01/2020",
        "officeAddress": "Ceuta, calle mendez alvaro 24",
        "id": "84657465M"
    ]
    ```

## Manage appointment from a specific office [/offices/{officeName}]
Manages appointments from a specific office.

### Check if there is an appointment [GET]

+ response 200 (application/json)
    + Body

    ```json
    {
        "office": {
            "code": "103",
            "label": "Ceuta"
        },
        "datesAvailable": [
            "21/11/2019",
            "22/11/2019",
            "26/11/2019",
            "27/11/2019",
            "28/11/2019"
        ],
        "isAppointmentAvailable": true
    }
    ```



