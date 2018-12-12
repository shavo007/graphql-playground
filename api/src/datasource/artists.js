import { RESTDataSource } from 'apollo-datasource-rest';

export default class ArtistsAPI extends RESTDataSource {
  // send headers on every request
  willSendRequest(request) {
    // request.headers.set('Authorization', this.context.token
    request.params.set('apikey', this.context.tmApiKey);
  }
  //
  // async didReceiveResponse(response) {
  // }

  async getMovie(id) {
    return this.get(`movies/${id}`);
  }

  async getAttractions(id) {
    return this.get(
      `https://app.ticketmaster.com/discovery/v2/attractions/${id}.json`
    );
  }

  async getEvents(id) {
    return this.get(
      `https://app.ticketmaster.com/discovery/v2/events.json?size=10&attractionId=${id}`
    );
  }
}
