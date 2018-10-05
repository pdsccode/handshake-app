// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (pathname) => {
  window.gtag('config', process.env.NINJA_social.googleAnalyticId, {
    // page_location: url,
    page_path: pathname
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}
