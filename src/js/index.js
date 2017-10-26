/* globals Dom7, Template7 */
var $$ = Dom7;

var tplRankingsHtml = $$('#tpl_rankings').html();
var tplRankings = Template7.compile(tplRankingsHtml);

var tpmSourcesHtml = $$('#tpl_sources').html();
var tplSources = Template7.compile(tpmSourcesHtml);
