import {Octokit} from "octokit";
import {Repository} from "@/components/home/repositories";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

function fetchRepositories(username: string): Promise<Repository[]> {
    return octokit.request('GET /users/{username}/repos', {
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
}

export {
    octokit,
    fetchRepositories
}
