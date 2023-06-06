import {Octokit} from "octokit";
import {Repository} from "@/components/home/repositories";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});
const cache: { [key: string]: Repository[] } = {};
const cacheTimes: { [key: string]: number } = {};

async function fetchRepositories(username: string): Promise<Repository[]> {
    if (cache[username] != null && cacheTimes[username] != null && cacheTimes[username] > Date.now() - 1000 * 60) {
        return Promise.resolve(cache[username]);
    }
    const repositories = await octokit.request('GET /users/{username}/repos', {
        accept: 'application/vnd.github+json',
        username: username,
        type: 'owner',
        sort: 'updated',
        per_page: 8,
        page: 1,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28',
        }
    })
        .then(response => response.data)
        .then(data => data
            .filter(repository => repository != null && !repository.private && !repository.fork)
            .sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0)))
        .then(data => data as Repository[]);
    cache[username] = repositories;
    cacheTimes[username] = Date.now();
    return repositories;
}

export {
    octokit,
    fetchRepositories
}
