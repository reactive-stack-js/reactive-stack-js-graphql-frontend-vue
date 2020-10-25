import _ from 'lodash';
import {jsonToGraphQLQuery} from 'json-to-graphql-query';

import AuthService from '@/_reactivestack/auth.service';

const VUE_APP_GRAPHQL_PATH = process.env.VUE_APP_GRAPHQL_PATH;

const sendMutationQuery = async (command, __args, fields) => {
	const mutation = {};
	mutation[command] = {__args};
	mutation[command] = _.merge(mutation[command], fields);
	const mutationQuery = jsonToGraphQLQuery({mutation}, {pretty: true});

	const response = await fetch(VUE_APP_GRAPHQL_PATH, {
		method: 'POST',
		headers: AuthService.getAuthHeader(),
		body: JSON.stringify({query: mutationQuery})
	});
	return await response.json();
};
export default sendMutationQuery;
