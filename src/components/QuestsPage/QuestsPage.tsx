import { Address, Badge, Blockie, Button, Color, Container, Header, HeaderMenu, Loader, Navbar, Page } from "decentraland-ui";
import LoginModal from "decentraland-dapps/dist/containers/LoginModal";
import { Props } from './types'
import { useEffect, useState } from "react";
import { getChainName } from "@dcl/schemas";
import { QuestInfoResponse } from "../../modules/quests/types";

export default function QuestsPage({ wallet, isConnected, isConnecting, info, signed, isSigning, onConnectWallet, onFetchInfo, onSign }: Props) {
	const [isModalOpen, setIsModalOpen] = useState(false)

	useEffect(() => {
		onFetchInfo()
	}, [onFetchInfo])

	useEffect(() => {
	if (isConnected && isModalOpen) {
		setIsModalOpen(false)
	}
	}, [isConnected, isModalOpen])

	useEffect(() => {
    if (!info) return
	}, [info])

	return (
		<div className="Page-story-container">
			<Navbar
					leftMenu={<></>}
					isConnected={isConnected}
					isConnecting={isConnecting}
					address={wallet?.address}
			/>
			<Page>
				<Container>
					<HeaderMenu>
						<HeaderMenu.Left>
							<Container textAlign="center">
								<Header size="large">
									{
										info?.actionType === "create" ? 
											`Create ${info?.extraData?.questName} Quest` : 
										info?.actionType === "list" ? 
											"List your Quests" : 
										info?.actionType === "activate" ? 
											`Activate Quest ${info?.extraData?.questId}` : 
										info?.actionType === "deactivate" ? 
											`Deactivate Quest ${info?.extraData?.questId}}`
										: "Unknown"
									}
								</Header>
							</Container>
						</HeaderMenu.Left>
					</HeaderMenu>
					<HeaderMenu>
						<HeaderMenu.Left>
							{
								!isConnected && (
									<Button
										primary
										size="medium"
										loading={isConnecting}
										onClick={() => setIsModalOpen(true)}
									>
										Connect Wallet
									</Button>
								)
							}
							{!!isConnected && wallet?.chainId && (
								<div className="address-header">
									<Badge color={Color.SHADOWS}>
										{getChainName(wallet.chainId)}
									</Badge>
								</div>
							)}
							<div className="address-header">
								{!!wallet?.address && (
									<Blockie scale={3} seed={wallet.address}>
										<Address tooltip strong value={wallet.address} />
									</Blockie>
								)}
							</div>
						</HeaderMenu.Left>
					</HeaderMenu>
				</Container>
				{!info && <Loader />}
				{isConnected && wallet.address && !signed && info?.actionType === "create" && info && (
						<CreateQuestComponent info={info} />
				)}
				{isConnected && wallet.address && !signed && info?.actionType === "list" && info && (
						<ListQuestsComponent info={info} />
				)}
				{isConnected && wallet.address && !signed && info?.actionType === "activate" && info && (
						<ActivateQuestsComponent info={info} />
				)}
				{isConnected && wallet.address && !signed && info?.actionType === "deactivate" && info && (
						<DeactivateQuestsComponent info={info} />
				)}
				{isConnected && !signed && info && (
					<Container className="sign-submit-container">
					<div>
						<Button
						primary
						size="medium"
						loading={isSigning}
						onClick={() => onSign(info!.messageToSign)}
						>
						Sign & Submit
						</Button>
					</div>
					</Container>
				)}
				{isModalOpen ? 
					<LoginModal
						name='QuestsPageLoginModal'
						onClose={() => setIsModalOpen(false)}
						isLoading={isConnecting}
						onConnect={onConnectWallet}
					/> 
					: null
				}
			</Page>
		</div>
	)
}

const CreateQuestComponent = ({ info }: { info: QuestInfoResponse }) => (
	<>
		<p>You're about to create a new Quest with name {info.extraData?.questName}.</p>
		<p>You will be the creator of the Quest and you will be the only one with access to 
			<strong>modify, deactivate, activate and see the defintion</strong>
		</p>
		<p>Let's check if you're okay with the Quest that will be created. Otherwise, you can cancel this from your SDK console.</p>
		<code>
			{JSON.stringify(info.extraData?.createQuest, null, 2)}
		</code>
	</>
)

const ListQuestsComponent = ({ info }: { info: QuestInfoResponse }) => (
	<>
		<p>You're about to sign a request to get a list of all your Quests</p>
		<code>
			{info.messageToSign}
		</code>
	</>
)

const ActivateQuestsComponent = ({ info }: { info: QuestInfoResponse }) => (
	<>
		<p>You're about to sign a request to activate your Quest {info.extraData?.questName}</p>
		<code>
			{info.messageToSign}
		</code>
	</>
)

const DeactivateQuestsComponent = ({ info }: { info: QuestInfoResponse }) => (
	<>
		<p>You're about to sign a request to deactivate your Quest {info.extraData?.questName}</p>
		<code>
			{info.messageToSign}
		</code>
	</>
)