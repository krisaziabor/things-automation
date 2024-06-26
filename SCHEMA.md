# Linear API Schema

While you can find the full JSON file of the API schema – also available at [this link](https://api.linear.app/graphql) – I have chosen to have a markdown file that displays the relevant API information to my queries. This file is subject to continuous changes.

This file requires stylistic changes.

## Cycles

```JSON

"""A set of issues to be resolved in a specified amount of time."""

type Cycle implements Node {
  """The unique identifier of the entity."""
  id: ID!

  """The time at which the entity was created."""
  createdAt: DateTime!

  """
  The last time at which the entity was meaningfully updated, i.e. for all changes of syncable properties except those
      for which updates should not produce an update to updatedAt (see skipUpdatedAtKeys). This is the same as the creation time if the entity hasn't
      been updated after creation.
  """
  updatedAt: DateTime!

  """
  The time at which the entity was archived. Null if the entity has not been archived.
  """
  archivedAt: DateTime

  """The number of the cycle."""
  number: Float!

  """The custom name of the cycle."""
  name: String

  """The cycle's description."""
  description: String

  """The start time of the cycle."""
  startsAt: DateTime!

  """The end time of the cycle."""
  endsAt: DateTime!

  """
  The completion time of the cycle. If null, the cycle hasn't been completed.
  """
  completedAt: DateTime

  """
  The time at which the cycle was automatically archived by the auto pruning process.
  """
  autoArchivedAt: DateTime

  """The total number of issues in the cycle after each day."""
  issueCountHistory: [Float!]!

  """The number of completed issues in the cycle after each day."""
  completedIssueCountHistory: [Float!]!

  """The total number of estimation points after each day."""
  scopeHistory: [Float!]!

  """The number of completed estimation points after each day."""
  completedScopeHistory: [Float!]!

  """The number of in progress estimation points after each day."""
  inProgressScopeHistory: [Float!]!

  """The team that the cycle is associated with."""
  team: Team!

  """Issues associated with the cycle."""
  issues(
    """Filter returned issues."""
    filter: IssueFilter

    """A cursor to be used with last for backward pagination."""
    before: String

    """A cursor to be used with first for forward pagination"""
    after: String

    """
    The number of items to forward paginate (used with after). Defaults to 50.
    """
    first: Int

    """
    The number of items to backward paginate (used with before). Defaults to 50.
    """
    last: Int

    """Should archived resources be included (default: false)"""
    includeArchived: Boolean

    """
    By which field should the pagination order by. Available options are createdAt (default) and updatedAt.
    """
    orderBy: PaginationOrderBy
  ): IssueConnection!

  """Issues that weren't completed when the cycle was closed."""
  uncompletedIssuesUponClose(
    """Filter returned issues."""
    filter: IssueFilter

    """A cursor to be used with last for backward pagination."""
    before: String

    """A cursor to be used with first for forward pagination"""
    after: String

    """
    The number of items to forward paginate (used with after). Defaults to 50.
    """
    first: Int

    """
    The number of items to backward paginate (used with before). Defaults to 50.
    """
    last: Int

    """Should archived resources be included (default: false)"""
    includeArchived: Boolean

    """
    By which field should the pagination order by. Available options are createdAt (default) and updatedAt.
    """
    orderBy: PaginationOrderBy
  ): IssueConnection!

  """
  The overall progress of the cycle. This is the (completed estimate points + 0.25 * in progress estimate points) / total estimate points.
  """
  progress: Float!
