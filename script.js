// Hakee teatterit kun body on latautunut
document.getElementsByTagName('body').onload = bodyLataus();
function bodyLataus() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', 'https://www.finnkino.fi/xml/TheatreAreas/', true);
  xmlhttp.send();

  xmlhttp.onreadystatechange=function() {
    if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      // Tallenna xml response data muuttujaan
      var xmltiedosto = xmlhttp.responseXML;

      var teatteriNimet = xmltiedosto.getElementsByTagName('Name');
      var teatteriID = xmltiedosto.getElementsByTagName('ID');

      for(var i = 0; i < teatteriNimet.length; i++) {
        // Hakee tekstit xml tiedostosta
        var theatreText = teatteriNimet[i].innerHTML;
        var teatteriIDs = teatteriID[i].innerHTML;

        // Hakee elokuvateattereiden ID:n ja nimen painikelistaan xml-tiedostosta
        document.getElementById('dropdown').innerHTML +=  '<option value = ' + teatteriIDs + '>' + theatreText + '</option>';
      }
    }
  }
};

// Teatterin valittua funktio hakee elokuvanäytökset ja elokuvien muut tiedot
document.getElementById('dropdown').addEventListener('change', ohjelmistoLataus);
function ohjelmistoLataus() {
  document.getElementsByClassName('uusi-task-input');
  document.getElementById('lista').innerHTML = '';
  var id = document.getElementById('dropdown').value;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('GET', 'https://www.finnkino.fi/xml/Schedule/?area=' + id, true);
  xmlhttp.send();

  xmlhttp.onreadystatechange = function () {
    if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var xmlDoc = xmlhttp.responseXML;

      var titles = xmlDoc.getElementsByTagName('Title');
      var imageURLs = xmlDoc.getElementsByTagName('EventSmallImagePortrait');
      var timeTable = xmlDoc.getElementsByTagName('dttmShowStart');
      var rating = xmlDoc.getElementsByTagName('RatingImageUrl');
      var contentDescriptors = xmlDoc.getElementsByTagName('ContentDescriptors');
      var duration = xmlDoc.getElementsByTagName('LengthInMinutes');
      var theatreNimi = xmlDoc.getElementsByTagName('TheatreAndAuditorium');
      

      // Silmukalla elokuvien tiedot
      for(var i = 0; i < titles.length; i++) {
        var imageURL = '<img class="images" src="' + imageURLs[i].innerHTML + '">';
        var title = titles[i].innerHTML;
        var xmlSchedule = timeTable[i].innerHTML;
        var ratingImg = '<img src="' + rating[i].innerHTML + '">';
        var xmlDuration = duration[i].innerHTML;
        var teatteriNimi = theatreNimi[i].innerHTML;
        
        // Aikataulutiedot xml-tiedostosta
        var time = xmlSchedule.slice(11, 16);
        var date = xmlSchedule.slice(8, 10);
        var month = xmlSchedule.slice(5,7);
        var year = xmlSchedule.slice(0,4);

        // Elokuvien ikärajoituskuvat
        var contentDescriptor = contentDescriptors[i].getElementsByTagName("ContentDescriptor");
        var descriptionImages = "";
        for(var j = 0; j < contentDescriptor.length; j++) {
          descriptionImages += '<img src="' + contentDescriptor[j].getElementsByTagName("ImageURL")[0].innerHTML + '">';
      }
      document.getElementById("lista").innerHTML += '<tr><td>'+ imageURL + '</td><td>' + title + '<br/>' + date + "."+ month+ "." + year + " " + time + '<br/>' + "Kesto: " + xmlDuration + " minuuttia <br/> <br/>" + teatteriNimi +'<br/> <br/>' + ratingImg + descriptionImages + '</td>';
    } 
  }
}
};

// Elokuvan etsintään, kun on valinnut teatterin
document.getElementById('etsi').addEventListener('keyup', etsiFunc);
function etsiFunc() {
  
  var input = document.getElementById('etsi');
  var filtteri = input.value.toUpperCase();
  var taulu = document.getElementById('lista');
  var tr = taulu.getElementsByTagName('tbody');

  // Silmukalla kaikki näytökset ja piilottaa ne, jotka eivät vastaa hakuehtoja
  for(var i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName('td')[1];
    teksti = td.innerHTML;
    if (teksti.toUpperCase().indexOf(filtteri) > -1) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }
};

// Tyhjentää etsikentän, kun sivu ladataan uudelleen
window.onload = function () {
  document.getElementById('etsi').value = '';
};
