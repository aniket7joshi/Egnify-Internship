const express = require('express');

const router = express.Router();

router.get('/download', (req, res, next) => {
  const fileName = `./csvFiles/${req.query.testName}.csv`;
  res.download(fileName);
  res.status(200);
});
router.get('/pdf',(req, res, next) => {
	var phantom = require('phantom');   
	var l = '';
	phantom.create().then(function(ph) {
	    ph.createPage().then(function(page) {
	        page.open(req.body.link).then(function(status) {
	        	l = './pdfFiles/' + req.body.link;
	            page.render(l).then(function() {
	                console.log('Page Rendered');
	                ph.exit();
	            });
	        });
	    });
	});
	res.status(200);
	res.download(l);
		
})
module.exports = router;
