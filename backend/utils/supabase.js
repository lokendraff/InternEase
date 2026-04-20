const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase = null;

// Initialize only if keys are present (prevents server crash if .env is missing)
if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log("Supabase Client Initialized");
} else {
    console.warn("Supabase keys missing in .env. Realtime features will be disabled.");
}

/**
 * Triggers a real-time broadcast event to a specific channel.
 * @param {String} channelName - The channel to broadcast to (e.g., 'student-12345')
 * @param {String} eventName - The name of the event (e.g., 'status_update')
 * @param {Object} payload - The data to send (e.g., new status, message)
 */
const triggerRealtimeNotification = (channelName, eventName, payload) => {
    if (!supabase) return;

    // Send a broadcast message without needing to save it in a Supabase table
    supabase.channel(channelName).send({
        type: 'broadcast',
        event: eventName,
        payload: payload
    });

    console.log(`⚡ Realtime Event '${eventName}' fired to channel '${channelName}'`);
};

module.exports = { triggerRealtimeNotification };