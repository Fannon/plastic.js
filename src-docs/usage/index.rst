Usage
=====

.. toctree::
   :maxdepth: 2
   :hidden:

   advanced
   wrapper

Download plastic.js
-------------------
First you need to download plastic.js from the project site or GitHub.
Extract the files to your according folders in your project.

It is recommended to include the version numbers in the filenames, to avoid caching problems.

Include plastic.js in your site
-------------------------------
Include the JavaScript and CSS file in your site. For production the minified version is recommended.

.. code-block:: html

    <link href="css/plastic.min.css" rel="stylesheet">

.. code-block:: html

    <script src="js/plastic.min.js"></script>

If you want to make sure that everything worked out, you can enter ``plastic.version`` into the web developer console.
This should return the version number of plastic.js

Write an embed code
-------------------
Now it is time to write a plastic embed code. In this documentation you'll find several examples, especially in the
Display Modules Section. If you copy'n'paste those, keep in mind that you might run into cross origin policy issues
which prevent the browser from fetching external data.
