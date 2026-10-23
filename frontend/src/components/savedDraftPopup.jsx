// import CSS
import "../componentStyling/savedDraftPopUp.css";

// import icons
import { useEffect, useState } from "react";
import { X, StepForward, Trash } from "lucide-react";

const requiredDraftFields = [
	(draft) => draft.animal?.type,
	(draft) => draft.animal?.species,
	(draft) => draft.animal?.scientificName,
	(draft) => draft.finder?.name,
	(draft) => draft.finder?.phone,
	(draft) => draft.finder?.reportedAt,
	(draft) => draft.incident?.address,
	(draft) => draft.incident?.foundAt,
	(draft) => draft.incident?.description,
];

function SavedDraftsPopUp({ onClose, onContinue, onCountChange }) {
	const [drafts, setDrafts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [deletingDraftId, setDeletingDraftId] = useState(null);

	useEffect(() => {
		const controller = new AbortController();

		const loadDrafts = async () => {
			try {
				const response = await fetch("/api/cases/drafts", {
					signal: controller.signal,
				});
				const result = await response.json();

				if (!response.ok) {
					throw new Error(
						result.message || `Request failed (${response.status})`,
					);
				}
				if (!Array.isArray(result)) {
					throw new Error("The server returned an invalid drafts response.");
				}

				setDrafts(result);
				onCountChange(result.length);
			} catch (fetchError) {
				if (fetchError.name !== "AbortError") {
					setError(fetchError.message || "Unable to load saved drafts.");
				}
			} finally {
				if (!controller.signal.aborted) setIsLoading(false);
			}
		};

		loadDrafts();
		return () => controller.abort();
	}, [onCountChange]);

	const handleDelete = async (draftId) => {
		setDeletingDraftId(draftId);
		setError("");

		try {
			const response = await fetch(`/api/cases/drafts/${draftId}`, {
				method: "DELETE",
			});
			const result = await response.json();

			if (!response.ok) {
				throw new Error(
					result.message || `Request failed (${response.status})`,
				);
			}
			if (!Number.isInteger(result.count) || result.count < 0) {
				throw new Error("The server returned an invalid draft count.");
			}

			setDrafts((currentDrafts) =>
				currentDrafts.filter((draft) => draft._id !== draftId),
			);
			onCountChange(result.count);
		} catch (deleteError) {
			setError(deleteError.message || "Unable to delete draft.");
		} finally {
			setDeletingDraftId(null);
		}
	};

	return (
		<div className="sd_popup_overlay" onClick={onClose}>
			<div
				className="sd_popup_container"
				role="dialog"
				aria-modal="true"
				aria-labelledby="saved-drafts-title"
				onClick={(event) => event.stopPropagation()}>
				<div className="sd_title_row">
					<div className="sd_tr_left">
						<h3 id="saved-drafts-title">Saved Admissions Drafts</h3>
						<p>Continue, rename or remove incomplete admission records.</p>
					</div>
					<button
						className="close_sd"
						type="button"
						onClick={onClose}
						aria-label="Close saved drafts">
						<X />
					</button>
				</div>
				<p>{drafts.length} Saved Drafts</p>
				{error && <p role="alert">{error}</p>}
				{isLoading ? (
					<p role="status">Loading drafts...</p>
				) : drafts.length === 0 ? (
					<p>No saved drafts yet.</p>
				) : (
					<div className="sd_draft_item">
						<div className="drafts_list_container">
							{drafts.map((draft) => {
								const completedRequiredFields = requiredDraftFields.filter(
									(getFieldValue) => Boolean(getFieldValue(draft)),
								).length;
								const lastEdited = new Date(draft.updatedAt);
								const lastEditedLabel = Number.isNaN(lastEdited.getTime())
									? "Unknown"
									: lastEdited.toLocaleString();

								return (
									<div className="saved_draft_item" key={draft._id}>
										<div className="sd_item_left">
											<h3>Draft</h3>
											<h3>
												{draft.animal?.species ||
													draft.animal?.scientificName ||
													"Unnamed animal"}
											</h3>
											<p>{draft.finder?.name || "Finder not entered"}</p>
										</div>
										<div className="sd_item_middle">
											<p>Last Edited: {lastEditedLabel}</p>
											<p>
												{completedRequiredFields} of {requiredDraftFields.length}{" "}
												required fields complete
											</p>
										</div>
										<div className="sd_item_right">
											<button
												className="continue_draft_btn"
												type="button"
												onClick={() => onContinue(draft)}>
												<h2>Continue</h2>
												<StepForward />
											</button>
											<button
												className="delete_draft_btn"
												type="button"
												onClick={() => handleDelete(draft._id)}
												disabled={deletingDraftId === draft._id}>
												<h2>
													{deletingDraftId === draft._id
														? "Deleting..."
														: "Delete"}
												</h2>
												<Trash />
											</button>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default SavedDraftsPopUp;
