
/* global plastic */

// Register query parser
plastic.queryParser.available['sparql'] = 'sparql';

/**
 * This is a SPARQL Query Parser
 * It turns the Query into an API URL
 *
 * TODO: Not implemented yet.
 */
plastic.queryParser.sparql = function(elData) {

//    var url = elData.data.url

//    http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=PREFIX+owl%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2002%2F07%2Fowl%23%3E%0D%0APREFIX+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%0D%0APREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0D%0APREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0APREFIX+foaf%3A+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0D%0APREFIX+dc%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%3E%0D%0APREFIX+%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2F%3E%0D%0APREFIX+dbpedia2%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fproperty%2F%3E%0D%0APREFIX+dbpedia%3A+%3Chttp%3A%2F%2Fdbpedia.org%2F%3E%0D%0APREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0D%0APREFIX+dbo%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%3E%0D%0A%0D%0ASELECT+%3Fname+%3Fbirth+%3Fdescription+%3Fperson+WHERE+%7B%0D%0A+++++%3Fperson+dbo%3AbirthPlace+%3ABerlin+.%0D%0A+++++%3Fperson+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fsubject%3E+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FCategory%3AGerman_musicians%3E+.%0D%0A+++++%3Fperson+dbo%3AbirthDate+%3Fbirth+.%0D%0A+++++%3Fperson+foaf%3Aname+%3Fname+.%0D%0A+++++%3Fperson+rdfs%3Acomment+%3Fdescription+.%0D%0A+++++FILTER+%28LANG%28%3Fdescription%29+%3D+%27en%27%29+.%0D%0A%7D%0D%0AORDER+BY+%3Fname&output=jsonp

};
