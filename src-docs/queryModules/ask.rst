ASK Queries
===========

Description
-----------
ASK is the query language to extract data from Semantic MediaWikis.

The wiki needs to have a public API that supports those queries.

Example Code
------------
.. literalinclude:: ../_includes/query/Ask_example.html
    :language: html


Live Example
------------
.. raw:: html
    :file: ../_includes/query/Ask_example.html


Options
-------
All options are given via HTML attributes.

type
....
States the MIME type and the query module / language to be used::

    type="application/ask-query"


data-query-url
..............
States the API URL of the targeted Semantic MediaWiki Installation::

    data-url="http://semwiki-exp01.multimedia.hs-augsburg.de/ba-wiki/api.php"

