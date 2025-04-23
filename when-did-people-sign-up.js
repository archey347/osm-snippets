var term_id = 1234
var event_id = 1234

r = await fetch("https://www.onlinescoutmanager.co.uk/v3/events/event/" + event_id + "/members/attendance?term_id=")
var data = await r.json()
var people = data.data
var attending = []
for(var id in people) {
    var person = people[id]
    if(person.attending != "yes") { continue; }
    r = await fetch("https://www.onlinescoutmanager.co.uk/v3/events/event/" + event_id + "/members/audit_trail/" + person.member_id)
    audit = await r.json()
    var signed_up_date = 0
    // Find the last time they signed up
    for (var audit_row_id in audit.data) {
        var row = audit.data[audit_row_id]
        if (row.description == "Attendance: Yes") {
            var d = Date.parse(row.date)
            if (d > signed_up_date) {
                signed_up_date = d
            }
        }
    }

    attending.push({ name: person.first_name + " " + person.last_name, date: signed_up_date})
}

attending.sort((a, b) => { return b.date - a.date })
for (var id in attending) { console.log((new Date(attending[id].date)) + " " + attending[id].name) }
