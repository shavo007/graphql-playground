export default {
  Query: {
    myFavoriteArtist: async (parent, { id }, { dataSources }) =>
      dataSources.artistsAPI.getAttractions(id)
  },
  Artist: {
    twitterUrl: artist => artist.externalLinks.twitter[0].url,
    image: artist => artist.images[0].url,
    events: async (artist, args, { dataSources }) => {
      const resp = await dataSources.artistsAPI.getEvents(`${artist.id}`);
      return resp._embedded.events || [];
    }
  },
  Event: {
    image: event => event.images[0].url,
    startDateTime: event => event.dates.start.dateTime
  }
};
