import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Grid,
  Label,
  Stack,
  Switch,
  Text,
  TextInput,
} from '@sanity/ui'

import type { PendingProject } from './types'

type FieldProps = {
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
}

const Field = ({ title, description, children }: FieldProps) => {
  return (
    <Stack space={3}>
      {(title || description) && (
        <Stack space={2}>
          {title ? <Label size={1}>{title}</Label> : null}
          {description ? (
            <Text size={1} muted>
              {description}
            </Text>
          ) : null}
        </Stack>
      )}
      {children}
    </Stack>
  )
}

type Props = {
  header: string
  id: string
  values: PendingProject
  setValues: React.Dispatch<React.SetStateAction<PendingProject>>
  onClose?: () => void
  onSubmit?: React.MouseEventHandler<HTMLButtonElement>
  onSubmitText?: string
  disabled?: boolean
  loading?: boolean
  hideAccessToken?: boolean
  hideDisableDeleteAction?: boolean
}

const DeployDialogForm = ({
  header,
  id,
  values,
  setValues,
  onClose,
  onSubmit,
  onSubmitText,
  disabled,
  loading,
  hideAccessToken,
  hideDisableDeleteAction,
}: Props) => {
  return (
    <Dialog
      animate
      header={header}
      id={id}
      width={1}
      onClickOutside={onClose}
      onClose={onClose}
      footer={
        <Box padding={3}>
          <Grid columns={2} gap={3}>
            <Button padding={3} mode="ghost" text="Cancel" onClick={onClose} />
            <Button
              padding={3}
              text={onSubmitText || 'Submit'}
              tone="primary"
              loading={loading}
              onClick={onSubmit}
              disabled={
                disabled ||
                !values.projectId ||
                !values.url ||
                !values.accessToken
              }
            />
          </Grid>
        </Box>
      }
    >
      <Box padding={4}>
        <Stack space={4}>
          <Field
            title="Display Name (internal use only)"
            description={
              <>
                This can be the environment you are deploying to, like{' '}
                <strong>Production</strong> or <strong>Staging</strong>
              </>
            }
          >
            <TextInput
              type="text"
              value={values.name}
              onChange={(e) => {
                const name = (e.target as HTMLInputElement).value
                setValues((prev) => ({ ...prev, name }))
              }}
            />
          </Field>

          <Field
            title="Project ID"
            description={`Vercel Project: Settings → General → "Project ID"`}
          >
            <TextInput
              type="text"
              value={values.projectId}
              onChange={(e) => {
                const projectId = (e.target as HTMLInputElement).value
                setValues((prev) => ({ ...prev, projectId }))
              }}
            />
          </Field>

          <Field
            title="Team ID"
            description={`Required for projects under a Vercel Team: Settings → General → "Team ID"`}
          >
            <TextInput
              type="text"
              value={values.teamId}
              onChange={(e) => {
                const teamId = (e.target as HTMLInputElement).value
                setValues((prev) => ({ ...prev, teamId }))
              }}
            />
          </Field>

          <Field
            title="Deploy Hook URL"
            description={`Vercel Project: Settings → Git → "Deploy Hooks"`}
          >
            <TextInput
              type="text"
              inputMode="url"
              value={values.url}
              onChange={(e) => {
                const url = (e.target as HTMLInputElement).value
                setValues((prev) => ({ ...prev, url }))
              }}
            />
          </Field>

          {hideAccessToken ? (
            <Field title="Access Token">
              <Card padding={4} radius={3} tone="caution">
                <Text>Access Token is hidden for security purposes.</Text>
              </Card>
            </Field>
          ) : (
            <Field
              title="Access Token"
              description={`Vercel Personal Account: Account Settings → "Tokens"`}
            >
              <TextInput
                type="text"
                value={values.accessToken}
                onChange={(e) => {
                  const accessToken = (e.target as HTMLInputElement).value
                  setValues((prev) => ({ ...prev, accessToken }))
                }}
              />
            </Field>
          )}

          {!hideDisableDeleteAction && (
            <Field>
              <Card tone="critical" padding={3} radius={2} border>
                <Flex align="center">
                  <Switch
                    id="disableDeleteAction"
                    style={{ display: 'block' }}
                    onChange={(e) => {
                      const isChecked = (e.target as HTMLInputElement).checked

                      setValues((prev) => ({
                        ...prev,
                        disableDeleteAction: isChecked,
                      }))
                    }}
                    checked={values.disableDeleteAction}
                  />
                  <Stack
                    as="label"
                    flex={1}
                    paddingLeft={3}
                    space={3}
                    htmlFor="disableDeleteAction"
                    style={{
                      cursor: 'pointer',
                    }}
                  >
                    <Text size={1} weight="medium">
                      Prevent deletion in production?
                    </Text>

                    <Text size={1} muted>
                      Disables the "Delete" action in Production builds of the
                      Studio.
                    </Text>
                  </Stack>
                </Flex>
              </Card>
            </Field>
          )}
        </Stack>
      </Box>
    </Dialog>
  )
}

export default DeployDialogForm
