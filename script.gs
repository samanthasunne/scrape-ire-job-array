function doGet() {
  var page = UrlFetchApp.fetch('https://ire.org/jobs/');
  var doc = Xml.parse(page, true);
  var bodyHtml = doc.html.body.toXmlString();
  doc = XmlService.parse(bodyHtml);
  var root = doc.getRootElement();
  var table = getElementsByClassName(root, 'job-listings body2 gray-45')[0];
  var output = [];
  var linksInTable = getElementsByTagName(table, 'td');
  var count = 0;
  for(i in linksInTable){    
    table_item= []
    table_item.push(linksInTable[i].getValue())
    output.push(table_item);
    Logger.log("What is row: ", table_item)
  }
  return output;
}

function create_master_array(input_data){
  // This helper function is called within writetospreadsheet()
  // It expects the output from the doGet function. Given this data, 
  // it will return nested arrays ... a large array containing many arrays inside of it.
  // Each of the smaller arrays contains the data for one row. 
  var counter = 0;
  var master_array = []
  var row_created = []
  
  // Here, we loop through all of the items passed in. 
  // We know we will have four columns of information.
  // We will go through, one by one, and add each property
  // to the variable row_created. 
  for(var i=0; i < input_data.length; i++){
    if (counter < 4){
      row_created.push(input_data[i])
      counter++
    }
    
   // After we have passed in four items, we know we have completed the row 
   // This means we can push our row (array) to the master_array.
    else{
      counter = 0;
      master_array.push(row_created)
      Logger.log("Row created is: ", row_created)
      row_created = []
      // Because this 'else' block will cause our i variable to count up one, we need to set it back one so that
      // we don't miss any items !
      i--
    }  
  }
  
  // Finally, we return master_array, which will have one array inside of it for each row returned
  return master_array;
  
  
}
 
function writetospreadsheet(){
  var sheet = SpreadsheetApp.getActiveSheet();
  var rows = sheet.getDataRange();
  // This spreadsheet variable will contain all of the data we download from the IRE Job Board
  var spreadsheet = doGet();
  // From this variable, we need to format the job information into rows so that the browser can render it effectively
  var row_container = create_master_array(spreadsheet)
  // Clear out existing rows on our spreadsheet from any existing data
  rows.clear();
  // For usability, let's put a header row indicating what information we'll store in each column.
  sheet.appendRow(['Job Name', 'Organization', 'Location', 'Posted Date'])
  // To help visually separate it from the rest of the data, we can make it bold. 
   var range = sheet.getRange("A1:D1");
  range.setFontWeight("bold");
  
  for (var i=0; i < row_container.length; i++) {
    row = [row_container[i][0].toString(), row_container[i][1].toString(), row_container[i][2].toString(), row_container[i][3].toString()]
    sheet.appendRow(row);}
}
