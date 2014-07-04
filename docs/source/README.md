#Welcome to the plastic.js documentation!
Documentation how to use the plastic.js framework. It's available on [GitHub](https://github.com/Fannon/plastic.js).

<script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
<link href="assets/css/plastic.css" type="text/css" rel="stylesheet" />
<script src="assets/js/plastic.js"></script>

<div id="table-ask-query" class="plastic-js" style="height: auto; width: 100%;">

    <script class="plastic-query" type="application/ask-query" data-query-url="http://semwiki-exp01.multimedia.hs-augsburg.de/ba-wiki/api.php">
        [[Kategorie:Mitarbeiter]]
        | ?Vorname=Vorname
        | ?Nachname=Nachname
        | ?Mail=Mail
        | ?Festnetz=Festnetz
        | ?Handy=Handy
        | limit=5
    </script>
    <script class="plastic-display" data-display-module="simple-table" type="application/json"></script>

</div>
