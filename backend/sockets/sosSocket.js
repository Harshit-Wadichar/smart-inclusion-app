/**
 * Initialize socket.io handling for SOS alerts.
 * The server will emit 'sosAlert' to connected clients when new SOS is created (controller emits too).
 * Also listen for volunteer connections and allow them to 'ack' an SOS.
 */
let ioRef;

function initSosSocket(io) {
  ioRef = io;
  io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on('ackSos', (payload) => {
      // payload: { sosId, volunteerId }
      // broadcast to admin/others
      io.emit('sosAcknowledged', payload);
    });

    socket.on('disconnect', () => {
      console.log('socket disconnected', socket.id);
    });
  });
}

module.exports = { initSosSocket, getIo: () => ioRef };
