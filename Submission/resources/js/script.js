let events = [];
let editingEventIndex = null;

document.addEventListener('DOMContentLoaded', function() {
  const locationField = document.getElementById('event_location').parentElement;
  const remoteUrlField = document.getElementById('event_remote_url').parentElement;
  locationField.style.display = 'none';
  remoteUrlField.style.display = 'none';

  const eventModal = document.getElementById('event_modal');

  eventModal.addEventListener('hidden.bs.modal', () => {
    editingEventIndex = null;
    document.getElementById('eventModalLabel').textContent = 'Create Event';
  });
});

function updateLocationOptions(modality) {
  const locationField = document.getElementById('event_location').parentElement;
  const remoteUrlField = document.getElementById('event_remote_url').parentElement;
  const locationInput = document.getElementById('event_location');
  const remoteUrlInput = document.getElementById('event_remote_url');

  if (modality === 'In Person') {
    locationField.style.display = 'block';
    locationInput.required = true;
    remoteUrlField.style.display = 'none';
    remoteUrlInput.required = false;
    remoteUrlInput.value = '';
  } else if (modality === 'Remote') {
    locationField.style.display = 'none';
    locationInput.required = false;
    locationInput.value = '';
    remoteUrlField.style.display = 'block';
    remoteUrlInput.required = true;
  } else {
    locationField.style.display = 'none';
    locationInput.required = false;
    remoteUrlField.style.display = 'none';
    remoteUrlInput.required = false;
  }
}

function saveEvent() {
  const name = document.getElementById('event_name').value;
  const weekday = document.getElementById('event_weekday').value;
  const time = document.getElementById('event_time').value;
  const modality = document.getElementById('event_modality').value;
  const location = document.getElementById('event_location').value;
  const remote_url = document.getElementById('event_remote_url').value;
  const attendees = document.getElementById('event_attendees').value;
  const category = document.getElementById('event_category').value;

  const eventDetails = {
    name: name,
    weekday: weekday,
    time: time,
    modality: modality,
    location: modality === 'In Person' ? location : null,
    remote_url: modality === 'Remote' ? remote_url : null,
    attendees: attendees,
    category: category
  };

  if (editingEventIndex !== null) {
    const oldWeekday = events[editingEventIndex].weekday;
    events[editingEventIndex] = eventDetails;

    const oldDayDiv = document.getElementById(oldWeekday.toLowerCase());
    const oldCard = oldDayDiv.querySelector(
      `.event[data-event-index="${editingEventIndex}"]`
    );
    if (oldCard) {
      oldDayDiv.removeChild(oldCard);
    }

    addEventToCalendarUI(eventDetails, editingEventIndex);

    editingEventIndex = null;
    document.getElementById('eventModalLabel').textContent = 'Create Event';
  } else {
    const newIndex = events.length;
    events.push(eventDetails);
    addEventToCalendarUI(eventDetails, newIndex);
  }

  console.log(events);

  document.getElementById('event_form').reset();
  const locationField = document.getElementById('event_location').parentElement;
  const remoteUrlField = document.getElementById('event_remote_url').parentElement;
  locationField.style.display = 'none';
  remoteUrlField.style.display = 'none';

  const modalElement = document.getElementById('event_modal');
  const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
  modalInstance.hide();
}

function createEventCard(eventDetails, eventIndex) {
  let event_element = document.createElement('div');

  event_element.classList = 'event row border rounded m-1 py-1';
  event_element.style.cursor = 'pointer';

  event_element.dataset.eventIndex = eventIndex;

  event_element.addEventListener('click', function() {
    const idx = parseInt(this.dataset.eventIndex, 10);
    editEvent(idx);
  });

  const categoryColors = {
    Academic: '#FFE5B4',
    Work: '#B4D7FF',
    Personal: '#FFB4D7',
    Social: '#D7FFB4',
    Other: '#E5E5E5'
  };

  event_element.style.backgroundColor =
    categoryColors[eventDetails.category] || '#FFFFFF';

  let info = document.createElement('div');

  let locationInfo = '';
  if (eventDetails.modality === 'In Person') {
    locationInfo = `<strong>Location:</strong> ${eventDetails.location}<br>`;
  } else if (eventDetails.modality === 'Remote') {
    locationInfo = `<strong>Remote URL:</strong> ${eventDetails.remote_url}<br>`;
  }

  info.innerHTML = `
    <strong>${eventDetails.name}</strong><br>
    <strong>Time:</strong> ${eventDetails.time}<br>
    <strong>Category:</strong> ${eventDetails.category}<br>
    <strong>Modality:</strong> ${eventDetails.modality}<br>
    ${locationInfo}
    <strong>Attendees:</strong> ${eventDetails.attendees || 'None'}
  `;

  event_element.appendChild(info);

  return event_element;
}

function addEventToCalendarUI(eventInfo, eventIndex) {
  const dayDiv = document.getElementById(eventInfo.weekday.toLowerCase());
  const event_card = createEventCard(eventInfo, eventIndex);
  dayDiv.appendChild(event_card);
}

function editEvent(eventIndex) {
  editingEventIndex = eventIndex;

  const event = events[eventIndex];

  document.getElementById('eventModalLabel').textContent = 'Update Event';

  document.getElementById('event_name').value = event.name;
  document.getElementById('event_weekday').value = event.weekday;
  document.getElementById('event_time').value = event.time;
  document.getElementById('event_modality').value = event.modality;
  document.getElementById('event_category').value = event.category;
  document.getElementById('event_attendees').value = event.attendees || '';

  if (event.modality === 'In Person') {
    document.getElementById('event_location').value = event.location || '';
    document.getElementById('event_remote_url').value = '';
  } else if (event.modality === 'Remote') {
    document.getElementById('event_remote_url').value = event.remote_url || '';
    document.getElementById('event_location').value = '';
  } else {
    document.getElementById('event_location').value = '';
    document.getElementById('event_remote_url').value = '';
  }

  updateLocationOptions(event.modality);

  const modalElement = document.getElementById('event_modal');
  const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElement);
  modalInstance.show();
}
