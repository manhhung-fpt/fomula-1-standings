import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';

// TODO: implement Cache type with generics for AxiosResponse
type Cache<T> = {
	timestamp: number;
	response: AxiosResponse<T>;
}

type Caches = {
	[url: string]: {
		[key: string]: Cache<any>
	}
}

function get<T = any, D = any>(url: string, config: AxiosRequestConfig<D> = {params: {limit: 500}}, cacheFor: number = 24 * 60 * 60): Promise<AxiosResponse<T>> {
	if (cacheFor) {
		const now            = Math.floor(Date.now() / 1000);
		const caches: Caches = JSON.parse((localStorage.getItem('Caxios') || 'null')) || {};
		const configKey      = btoa(JSON.stringify(config || {}));
		if (caches !== null) {
			if (Number(caches?.[url]?.[configKey]?.timestamp + cacheFor) > now) {
				return new Promise((resolve) => {
					resolve(caches?.[url]?.[configKey]?.response);
				});
			}
		}
		
		return axios.get<T, AxiosResponse<T>, D>(url, config)
		            .then((response) => {
			            localStorage.setItem('Caxios', JSON.stringify({
				            ...caches,
				            [url]: {
					            ...caches[url] || {},
					            [configKey]: {
						            timestamp: Date.now(),
						            response
					            }
				            }
			            }));
			
			            return response;
		            });
	}
	
	return axios.get<T, AxiosResponse<T>, D>(url, config);
}

const Caxios = {
	get
};

export default Caxios;