SPARQL Queries
==============

Description
-----------
SPARQL is a W3C standard query language.
It works with Semantic Web databases, which are also called RDF Stores, Triplestores or SPARQL Endpoints.


Example Code
------------
.. literalinclude:: ../_includes/query/Sparql_example.html
    :language: html


Live Example
------------
.. note:: dbpedia is often unreachable or slow.
    In that case the plastic element below will break.

.. raw:: html
    :file: ../_includes/query/Sparql_example.html


Options
-------
All options are given via HTML attributes:

type
....
States the MIME type and the query module / language to be used::

    type="application/sparql-query"


data-query-url
..............
URL to SPARQL endpoint::

    data-query-url="http://dbpedia.org/sparql"

