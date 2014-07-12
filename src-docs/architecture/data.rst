Internal Data Format
====================

plastic.js has an internal data format that every incoming data is reduced/expanded to.
This ensures the cross compatibility of the display modules and other internal functions.

The internal data format is has also a corresponding `Default Data Module <../dataModules/default.html>`_

Example
-------

Schema
------
.. code-block:: json

    {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",

        "properties": {
            "data": {
                "type": "array",
                "items": {
                    "type": "object",
                    "additionalProperties": {
                        "type": "array"
                    }
                }
            },
            "schema": {
                "type": "object",
                "additionalProperties": {
                    "type": "object"
                }
            },
            "description": {
                "type": "object"
            }
        },
        "required": ["data"]
    }

Background
----------
One of the big challenges in developing this framework was to decide on an internal data format,
which has to work with every incoming data type and also the “outgoing” display modules.
This proves especially difficult since the incoming data could be in tabular structure,
but also in a tree or even graph structure.

Since the graph structure is the most flexible one and can contain every other structure within,
this seems to be a good choice for an all-purpose data structure.
However this leads to choosing the most complex structure as the common denominator and complicates
originally simple data structures significantly. The alternative would be to choose the simplest common data storage type
which can be a simple table. RDF has demonstrated that a complex graph can be stored as triples in a simple three column table.

The decision was made to go with the simplest possible data format that still allows for some flexibility.
It consists of a table where each table cell is an array of zero or more Strings, Numbers or in some cases Objects.
Objects provide further flexibility since they can represent more complex Entities like GeoCoordinates.
But with the use of schemas – which will be described below - even a simple type like a string can be declared to be a date for example.


